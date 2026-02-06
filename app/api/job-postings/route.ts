// /api/job-postings
// GET — 공고 목록 조회 (취준생·비로그인용, 페이지네이션, 인증 선택)

import { getAuthSession } from "@/lib/auth-helpers";
import { error } from "@/lib/api";
import { prisma } from "@/lib/db";

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
          applicationUrl: true,
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
      applicationUrl: p.applicationUrl ?? null,
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
