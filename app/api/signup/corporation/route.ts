// POST /api/signup/corporation — 기업 등록
// role=CORPORATION인 사용자만 호출 가능, 1회 등록

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { validateCorporationSignup } from "@/lib/validations/signup";
import type { CorporationSignupRequest } from "@/types/signup";
import type { CompanySize } from "@/prisma/generated/prisma/client";

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  // 요청 파싱 + 유효성 검증
  const body = await parseBody<CorporationSignupRequest>(request);
  if (!body) return error("INVALID_JSON");

  const validation = validateCorporationSignup(body);
  if (!validation.ok) return error("VALIDATION_ERROR", validation.message);

  const data = validation.data;

  try {
    // 역할 확인 + 중복 등록 방지
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, corporation: { select: { id: true } } },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (!user.role) return error("ROLE_NOT_SET");
    if (user.role !== "CORPORATION") return error("ROLE_MISMATCH");
    if (user.corporation) return error("PROFILE_ALREADY_EXISTS");

    // 기업 정보 생성
    const corporation = await prisma.corporation.create({
      data: {
        userId,
        name: data.name.trim(),
        industry: data.industry.trim(),
        address: data.address.trim(),
        companySize: data.companySize as CompanySize,
        thumbnailUrl: data.thumbnailUrl?.trim() || null,
        description: data.description?.trim() || null,
        welfare: data.welfare?.trim() || null,
        homepageUrl: data.homepageUrl?.trim() || null,
        phone: data.phone?.trim() || null,
      },
      select: { id: true, name: true, createdAt: true },
    });

    return success(corporation, 201);
  } catch {
    return error("DB_ERROR");
  }
}
