// GET  — 취준생 내 프로필 조회
// PATCH — 취준생 프로필 수정

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateJobSeekerSignup } from "@/lib/validations/signup";
import type { JobSeekerSignupRequest } from "@/types/signup";

export async function GET() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        educationLevel: true,
        major: true,
        desiredJobRole: true,
        militaryStatus: true,
        desiredLocation: true,
        desiredSalaryRange: true,
        commuteStart: true,
        commuteEnd: true,
        employmentType: true,
        birthDate: true,
        gender: true,
        skills: { select: { skillName: true } },
      },
    });

    if (!profile) return error("PROFILE_NOT_FOUND");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role !== "JOB_SEEKER") return error("ROLE_MISMATCH");

    const { skills: skillRows, ...rest } = profile;
    const data = {
      ...rest,
      birthDate: profile.birthDate.toISOString().slice(0, 10),
      skills: skillRows.map((s) => s.skillName),
    };

    return success(data);
  } catch (err) {
    console.error("[GET /api/job-seeker/profile]", err);
    return error("DB_ERROR");
  }
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  const body = await parseBody<JobSeekerSignupRequest>(request);
  if (!body) return error("INVALID_JSON");

  const validation = validateJobSeekerSignup(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, userProfile: { select: { id: true } } },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (user.role !== "JOB_SEEKER") return error("ROLE_MISMATCH");
    if (!user.userProfile) return error("PROFILE_NOT_FOUND");

    const profileId = user.userProfile.id;

    await prisma.$transaction([
      prisma.userProfile.update({
        where: { id: profileId },
        data: {
          educationLevel: data.educationLevel,
          major: data.major.trim(),
          desiredJobRole: data.desiredJobRole.trim(),
          militaryStatus: data.militaryStatus,
          desiredLocation: data.desiredLocation?.trim() ?? null,
          desiredSalaryRange: data.desiredSalaryRange ?? null,
          commuteStart: data.commuteStart ?? null,
          commuteEnd: data.commuteEnd ?? null,
          employmentType: data.employmentType ?? null,
          birthDate: new Date(data.birthDate),
          gender: data.gender,
        },
      }),
      prisma.userSkill.deleteMany({ where: { userProfileId: profileId } }),
    ]);

    if (data.skills?.length) {
      await prisma.userSkill.createMany({
        data: data.skills.map((name) => ({
          userProfileId: profileId,
          skillName: name.trim(),
        })),
      });
    }

    return success({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/job-seeker/profile]", err);
    return error("DB_ERROR");
  }
}
