// /api/corporation/job-postings/[id]
// PATCH  — 자사 공고 수정
// DELETE — 자사 공고 삭제

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateUpdateJobPosting } from "@/lib/validations/job-posting";
import type { UpdateJobPostingRequest } from "@/types/job-posting";
import type {
  EducationLevel,
  SalaryRange,
  FilterPolicy,
} from "@/prisma/generated/prisma/client";

// ── 기업 역할 + 소유권 확인 공통 헬퍼 ──

async function requireOwnership(userId: string, postingId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      corporation: { select: { id: true } },
    },
  });

  if (!user) return { ok: false as const, err: error("USER_NOT_FOUND") };
  if (!user.role) return { ok: false as const, err: error("ROLE_NOT_SET") };
  if (user.role !== "CORPORATION")
    return { ok: false as const, err: error("ROLE_MISMATCH") };
  if (!user.corporation)
    return { ok: false as const, err: error("CORPORATION_NOT_FOUND") };

  const posting = await prisma.jobPosting.findUnique({
    where: { id: postingId },
    select: { corporationId: true },
  });

  if (!posting)
    return { ok: false as const, err: error("JOB_POSTING_NOT_FOUND") };
  if (posting.corporationId !== user.corporation.id)
    return {
      ok: false as const,
      err: error("FORBIDDEN", "본인 기업의 공고만 접근할 수 있습니다."),
    };

  return { ok: true as const, err: null };
}

// ────────────────────────────────────────
// PATCH /api/corporation/job-postings/[id]
// ────────────────────────────────────────

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return error("VALIDATION_ERROR", "공고 ID가 필요합니다.");
  }

  const userId = session!.user.id;

  const body = await parseBody<UpdateJobPostingRequest>(request);
  if (!body) return error("INVALID_JSON");

  const validation = validateUpdateJobPosting(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    const ownership = await requireOwnership(userId, id);
    if (!ownership.ok) return ownership.err;

    // 업데이트할 필드 구성
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.jobTrack !== undefined)
      updateData.jobTrack = data.jobTrack.trim();
    if (data.status !== undefined) updateData.status = data.status;
    if (data.minEducationLevel !== undefined)
      updateData.minEducationLevel = data.minEducationLevel as EducationLevel;
    if (data.militaryPolicy !== undefined)
      updateData.militaryPolicy = data.militaryPolicy as FilterPolicy;
    if (data.careerPolicy !== undefined)
      updateData.careerPolicy = data.careerPolicy as FilterPolicy;
    if (data.deadline !== undefined)
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    if (data.preferredCondition !== undefined)
      updateData.preferredCondition =
        data.preferredCondition?.trim() || null;
    if (data.salaryRange !== undefined)
      updateData.salaryRange = (data.salaryRange as SalaryRange) || null;
    if (data.salaryDescription !== undefined)
      updateData.salaryDescription =
        data.salaryDescription?.trim() || null;
    if (data.location !== undefined)
      updateData.location = data.location?.trim() || null;
    if (data.workStart !== undefined)
      updateData.workStart = data.workStart || null;
    if (data.workEnd !== undefined)
      updateData.workEnd = data.workEnd || null;
    if (data.applicationUrl !== undefined)
      updateData.applicationUrl = data.applicationUrl?.trim() || null;
    if (data.aiEvalCredential !== undefined)
      updateData.aiEvalCredential = data.aiEvalCredential;
    if (data.aiEvalExperience !== undefined)
      updateData.aiEvalExperience = data.aiEvalExperience;
    if (data.aiEvalAward !== undefined)
      updateData.aiEvalAward = data.aiEvalAward;

    // 기술 스택 업데이트 (전체 교체 방식)
    if (data.skills !== undefined) {
      await prisma.jobSkill.deleteMany({ where: { jobPostingId: id } });
      if (data.skills.length > 0) {
        await prisma.jobSkill.createMany({
          data: data.skills.map((skillName) => ({
            jobPostingId: id,
            skillName: skillName.trim(),
          })),
        });
      }
    }

    const updated = await prisma.jobPosting.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    return success({
      id: updated.id,
      title: updated.title,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch {
    return error("DB_ERROR");
  }
}

// ────────────────────────────────────────
// DELETE /api/corporation/job-postings/[id]
// ────────────────────────────────────────

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return error("VALIDATION_ERROR", "공고 ID가 필요합니다.");
  }

  const userId = session!.user.id;

  try {
    const ownership = await requireOwnership(userId, id);
    if (!ownership.ok) return ownership.err;

    await prisma.jobPosting.delete({ where: { id } });

    return success({ id, deleted: true });
  } catch {
    return error("DB_ERROR");
  }
}
