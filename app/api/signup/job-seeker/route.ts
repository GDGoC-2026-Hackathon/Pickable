// POST /api/signup/job-seeker — 취준생 프로필 등록
// role=JOB_SEEKER인 사용자만 호출 가능, 1회 등록

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateJobSeekerSignup } from "@/lib/validations/signup";
import type { JobSeekerSignupRequest } from "@/types/signup";

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  // 요청 파싱 + 유효성 검증
  const body = await parseBody<JobSeekerSignupRequest>(request);
  if (!body) return error("INVALID_JSON");

  const validation = validateJobSeekerSignup(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    // 역할 확인 + 중복 프로필 방지
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, userProfile: { select: { id: true } } },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (!user.role) return error("ROLE_NOT_SET");
    if (user.role !== "JOB_SEEKER") return error("ROLE_MISMATCH");
    if (user.userProfile) return error("PROFILE_ALREADY_EXISTS");

    // 트랜잭션으로 프로필 + 서브 데이터 일괄 생성
    const profile = await prisma.userProfile.create({
      data: {
        userId,

        // Hard Filter
        educationLevel: data.educationLevel,
        major: data.major.trim(),
        desiredJobRole: data.desiredJobRole.trim(),
        militaryStatus: data.militaryStatus,

        // 선호 조건
        desiredLocation: data.desiredLocation?.trim(),
        desiredSalaryRange: data.desiredSalaryRange,
        commuteStart: data.commuteStart,
        commuteEnd: data.commuteEnd,
        employmentType: data.employmentType,

        // 기본 정보
        birthDate: new Date(data.birthDate),
        gender: data.gender,

        // 서브 테이블 (nested create)
        skills: data.skills?.length
          ? { create: data.skills.map((name) => ({ skillName: name.trim() })) }
          : undefined,

        experiences: data.experiences?.length
          ? {
              create: data.experiences.map((exp) => ({
                type: exp.type,
                title: exp.title.trim(),
                description: exp.description?.trim(),
                isJobRelated: exp.isJobRelated ?? false,
              })),
            }
          : undefined,

        credentials: data.credentials?.length
          ? {
              create: data.credentials.map((cred) => ({
                type: cred.type,
                name: cred.name.trim(),
                score: cred.score?.trim() || null,
              })),
            }
          : undefined,
      },
      select: { id: true, createdAt: true },
    });

    return success(profile, 201);
  } catch {
    return error("DB_ERROR");
  }
}
