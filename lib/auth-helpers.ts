// API 라우트용 인증 헬퍼

import { auth } from "@/auth";
import { error } from "@/lib/api";

export async function getAuthSession() {
  return await auth();
}

// 인증 필수 API에서 사용. 미인증 시 401 응답 반환
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    return { session: null, errorResponse: error("UNAUTHORIZED") };
  }

  return { session, errorResponse: null };
}
