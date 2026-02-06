// /api/corporation/job-postings
// GET  — 자사 공고 목록 조회 (활성 공고 기본, 기업 전용)
// POST — 자사 공고 생성 (기업 전용)

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateCreateJobPosting } from "@/lib/validations/job-posting";
import type { CreateJobPostingRequest } from "@/types/job-posting";
import type {
  EducationLevel,
  SalaryRange,
  FilterPolicy,
} from "@/prisma/generated/prisma/client";

// ── 기업 역할 + 기업 정보 확인 공통 헬퍼 ──

async function requireCorporation(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      corporation: { select: { id: true } },
    },
  });

  if (!user) return { corporation: null, err: error("USER_NOT_FOUND") };
  if (!user.role) return { corporation: null, err: error("ROLE_NOT_SET") };
  if (user.role !== "CORPORATION")
    return { corporation: null, err: error("ROLE_MISMATCH") };
  if (!user.corporation)
    return { corporation: null, err: error("CORPORATION_NOT_FOUND") };

  return { corporation: user.corporation, err: null };
}

// ── D-day 계산 헬퍼 ──

function calcDaysLeft(deadline: Date | null): number | null {
  if (!deadline) return null; // 상시채용
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ────────────────────────────────────────
// GET /api/corporation/job-postings
// 자사 공고 목록 조회
// ────────────────────────────────────────

export async function GET(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 10)
  );
  const skip = (page - 1) * limit;

  try {
    const { corporation, err } = await requireCorporation(userId);
    if (err) return err;

    const corporationId = corporation!.id;

    // 기본: 활성 공고만 (status=OPEN AND 마감일이 없거나 오늘 이후)
    // status 파라미터로 OPEN/CLOSED/ALL 선택 가능
    const statusParam = searchParams.get("status"); // OPEN | CLOSED | ALL
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any;

    if (statusParam === "ALL") {
      // 전체 조회
      where = { corporationId };
    } else if (statusParam === "CLOSED") {
      // 마감된 공고만
      where = {
        corporationId,
        OR: [
          { status: "CLOSED" },
          { deadline: { lt: now }, status: "OPEN" },
        ],
      };
    } else {
      // 기본값: 활성 공고만 (OPEN + 마감일 미경과)
      where = {
        corporationId,
        status: "OPEN",
        OR: [{ deadline: null }, { deadline: { gte: now } }],
      };
    }

    const [total, postings] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          jobTrack: true,
          status: true,
          deadline: true,
          location: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const data = postings.map((p) => ({
      id: p.id,
      title: p.title,
      jobTrack: p.jobTrack,
      status: p.status,
      deadline: p.deadline?.toISOString() ?? null,
      daysLeft: calcDaysLeft(p.deadline),
      location: p.location,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return success({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return error("DB_ERROR");
  }
}

// ────────────────────────────────────────
// POST /api/corporation/job-postings
// 자사 공고 생성
// ────────────────────────────────────────

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  const body = await parseBody<CreateJobPostingRequest>(request);
  if (!body) return error("INVALID_JSON");

  const validation = validateCreateJobPosting(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    const { corporation, err } = await requireCorporation(userId);
    if (err) return err;

    const corporationId = corporation!.id;

    const posting = await prisma.jobPosting.create({
      data: {
        corporationId,

        title: data.title.trim(),
        jobTrack: data.jobTrack.trim(),

        minEducationLevel: data.minEducationLevel as EducationLevel,
        militaryPolicy: data.militaryPolicy as FilterPolicy,
        careerPolicy: data.careerPolicy as FilterPolicy,

        deadline: data.deadline ? new Date(data.deadline) : null,
        preferredCondition: data.preferredCondition?.trim() || null,
        salaryRange: (data.salaryRange as SalaryRange) || null,
        salaryDescription: data.salaryDescription?.trim() || null,
        location: data.location?.trim() || null,
        workStart: data.workStart || null,
        workEnd: data.workEnd || null,
        applicationUrl: data.applicationUrl?.trim() || null,

        aiEvalCredential: data.aiEvalCredential ?? false,
        aiEvalExperience: data.aiEvalExperience ?? false,
        aiEvalAward: data.aiEvalAward ?? false,

        skills: data.skills?.length
          ? {
              create: data.skills.map((skillName) => ({
                skillName: skillName.trim(),
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    return success(
      {
        id: posting.id,
        title: posting.title,
        status: posting.status,
        createdAt: posting.createdAt.toISOString(),
      },
      201
    );
  } catch {
    return error("DB_ERROR");
  }
}
