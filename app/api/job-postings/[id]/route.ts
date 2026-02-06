// GET /api/job-postings/[id] — 공고 상세 조회

import { getAuthSession } from "@/lib/auth-helpers";
import { error } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return error("VALIDATION_ERROR", "공고 ID가 필요합니다.");
  }

  try {
    const posting = await prisma.jobPosting.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        jobTrack: true,
        status: true,

        // Hard Filter
        minEducationLevel: true,
        militaryPolicy: true,
        careerPolicy: true,

        // 조건
        deadline: true,
        preferredCondition: true,
        salaryRange: true,
        salaryDescription: true,
        location: true,
        workStart: true,
        workEnd: true,
        applicationUrl: true,

        // AI 평가
        aiEvalCredential: true,
        aiEvalExperience: true,
        aiEvalAward: true,

        // 기술 스택
        skills: { select: { skillName: true } },

        createdAt: true,
        updatedAt: true,

        // 기업 정보
        corporation: {
          select: {
            id: true,
            name: true,
            description: true,
            thumbnailUrl: true,
            industry: true,
            address: true,
            companySize: true,
            homepageUrl: true,
            tags: { select: { tagName: true } },
          },
        },
      },
    });

    if (!posting) {
      return error("JOB_POSTING_NOT_FOUND");
    }

    // 매칭률 조회 (로그인 취준생인 경우)
    let matchRate: number | null = null;
    const session = await getAuthSession();

    if (session?.user?.id) {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (profile) {
        const matchResult = await prisma.matchingResult.findUnique({
          where: {
            userProfileId_jobPostingId: {
              userProfileId: profile.id,
              jobPostingId: posting.id,
            },
          },
          select: { score: true },
        });
        matchRate = matchResult?.score ?? null;
      }
    }

    const data = {
      id: posting.id,
      title: posting.title,
      jobTrack: posting.jobTrack,
      status: posting.status,

      minEducationLevel: posting.minEducationLevel,
      militaryPolicy: posting.militaryPolicy,
      careerPolicy: posting.careerPolicy,

      deadline: posting.deadline?.toISOString() ?? null,
      preferredCondition: posting.preferredCondition,
      salaryRange: posting.salaryRange,
      salaryDescription: posting.salaryDescription,
      location: posting.location,
      workStart: posting.workStart,
      workEnd: posting.workEnd,
      applicationUrl: posting.applicationUrl,

      aiEvalCredential: posting.aiEvalCredential,
      aiEvalExperience: posting.aiEvalExperience,
      aiEvalAward: posting.aiEvalAward,

      skills: posting.skills.map((s) => s.skillName),
      matchRate,
      createdAt: posting.createdAt.toISOString(),
      updatedAt: posting.updatedAt.toISOString(),

      corporation: {
        id: posting.corporation.id,
        name: posting.corporation.name,
        description: posting.corporation.description,
        thumbnailUrl: posting.corporation.thumbnailUrl,
        industry: posting.corporation.industry,
        address: posting.corporation.address,
        companySize: posting.corporation.companySize,
        homepageUrl: posting.corporation.homepageUrl,
        tags: posting.corporation.tags.map((t) => t.tagName),
      },
    };

    return Response.json({ data }, { status: 200 });
  } catch {
    return error("DB_ERROR");
  }
}
