// GET /api/signup/status — 현재 사용자의 가입 상태 조회
// 역할 선택 여부 + 프로필 등록 여부를 반환

import { requireAuth } from "@/lib/auth-helpers";
import { success, error } from "@/lib/api";
import { prisma } from "@/lib/db";

export async function GET() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        userProfile: { select: { id: true } },
        corporation: { select: { id: true } },
      },
    });

    if (!user) return error("USER_NOT_FOUND");

    const hasProfile =
      user.role === "JOB_SEEKER"
        ? !!user.userProfile
        : user.role === "CORPORATION"
          ? !!user.corporation
          : false;

    return success({ role: user.role, hasProfile });
  } catch (err) {
    // 개발 시 터미널에서 실제 원인 확인
    console.error("[GET /api/signup/status]", err);
    return error("DB_ERROR");
  }
}
