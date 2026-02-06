// POST /api/signup/role — 역할 선택 (JOB_SEEKER | CORPORATION)
// 로그인 후 최초 1회만 설정 가능

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateRole } from "@/lib/validations/signup";

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  // 요청 파싱
  const body = await parseBody(request);
  if (!body) return error("INVALID_JSON");

  // 유효성 검증
  const validation = validateRole(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  try {
    // 이미 역할이 설정된 경우 거부
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (user.role) return error("ROLE_ALREADY_SET");

    // 역할 저장
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: validation.data },
      select: { id: true, role: true },
    });

    return success(updated, 201);
  } catch {
    return error("DB_ERROR");
  }
}
