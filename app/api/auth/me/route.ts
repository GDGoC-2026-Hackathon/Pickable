// GET /api/auth/me — 현재 로그인 사용자 정보

import { requireAuth } from "@/lib/auth-helpers";
import { success } from "@/lib/api";

export async function GET() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  return success({
    id: session!.user.id,
    name: session!.user.name,
    email: session!.user.email,
    image: session!.user.image,
  });
}
