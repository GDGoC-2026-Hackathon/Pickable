// /api/job-postings
// GET  — 공고 목록 조회 (페이지네이션, 인증 선택)
// POST — 공고 생성 (기업 전용, 인증 필수)

import { requireAuth, getAuthSession } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateCreateJobPosting } from "@/lib/validations/job-posting";
import type { CreateJobPostingRequest } from "@/types/job-posting";
import type {
  EducationLevel,
  SalaryRange,
  FilterPolicy,
} from "@/prisma/generated/prisma/client";

// ────────────────────────────────────────
// GET  /api/job-postings — 공고 목록 조회
// ────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
  const skip = (page - 1) * limit;
  const statusFilter = searchParams.get("status"); // OPEN | CLOSED

  try {
    // 인증 여부 확인 (선택) — 인증된 취준생이면 매칭률 포함
    const session = await getAuthSession();
    let userProfileId: string | null = null;

    if (session?.user?.id) {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      userProfileId = profile?.id ?? null;
    }

    // 필터 조건
    const where: Record<string, unknown> = {};
    if (statusFilter === "OPEN" || statusFilter === "CLOSED") {
      where.status = statusFilter;
    }

    // 총 개수 + 목록 동시 조회
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
          status: true,
          deadline: true,
          preferredCondition: true,
          salaryRange: true,
          salaryDescription: true,
          location: true,
          workStart: true,
          workEnd: true,
          createdAt: true,
          corporation: {
            select: {
              id: true,
              name: true,
              description: true,
              thumbnailUrl: true,
              tags: { select: { tagName: true } },
            },
          },
        },
      }),
    ]);

    // 매칭률 조회 (로그인 취준생인 경우)
    let matchMap = new Map<string, number>();
    if (userProfileId && postings.length > 0) {
      const postingIds = postings.map((p) => p.id);
      const matches = await prisma.matchingResult.findMany({
        where: {
          userProfileId,
          jobPostingId: { in: postingIds },
        },
        select: { jobPostingId: true, score: true },
      });
      matchMap = new Map(matches.map((m) => [m.jobPostingId, m.score]));
    }

    // 응답 매핑
    const data = postings.map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      deadline: p.deadline?.toISOString() ?? null,
      preferredCondition: p.preferredCondition,
      salaryRange: p.salaryRange,
      salaryDescription: p.salaryDescription,
      location: p.location,
      workStart: p.workStart,
      workEnd: p.workEnd,
      matchRate: matchMap.get(p.id) ?? null,
      createdAt: p.createdAt.toISOString(),
      corporation: {
        id: p.corporation.id,
        name: p.corporation.name,
        description: p.corporation.description,
        thumbnailUrl: p.corporation.thumbnailUrl,
        tags: p.corporation.tags.map((t) => t.tagName),
      },
    }));

    return Response.json(
      {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch {
    return error("DB_ERROR");
  }
}

// ────────────────────────────────────────
// POST /api/job-postings — 공고 생성
// ────────────────────────────────────────

export async function POST(request: Request) {
  // 인증 확인
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  // 요청 파싱
  const body = await parseBody<CreateJobPostingRequest>(request);
  if (!body) return error("INVALID_JSON");

  // 유효성 검증
  const validation = validateCreateJobPosting(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    // 역할 확인 (기업만 공고 등록 가능)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        corporation: { select: { id: true } },
      },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (!user.role) return error("ROLE_NOT_SET");
    if (user.role !== "CORPORATION") return error("ROLE_MISMATCH");
    if (!user.corporation) return error("CORPORATION_NOT_FOUND");

    const corporationId = user.corporation.id;

    // 공고 생성 (기술 스택 포함)
    const posting = await prisma.jobPosting.create({
      data: {
        corporationId,

        // 기본 정보
        title: data.title.trim(),
        jobTrack: data.jobTrack.trim(),

        // Hard Filter
        minEducationLevel: data.minEducationLevel as EducationLevel,
        militaryPolicy: data.militaryPolicy as FilterPolicy,
        careerPolicy: data.careerPolicy as FilterPolicy,

        // 조건
        deadline: data.deadline ? new Date(data.deadline) : null,
        preferredCondition: data.preferredCondition?.trim() || null,
        salaryRange: (data.salaryRange as SalaryRange) || null,
        salaryDescription: data.salaryDescription?.trim() || null,
        location: data.location?.trim() || null,
        workStart: data.workStart || null,
        workEnd: data.workEnd || null,
        applicationUrl: data.applicationUrl?.trim() || null,

        // AI 평가
        aiEvalCredential: data.aiEvalCredential ?? false,
        aiEvalExperience: data.aiEvalExperience ?? false,
        aiEvalAward: data.aiEvalAward ?? false,

        // 기술 스택
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
