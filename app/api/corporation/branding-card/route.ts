// /api/corporation/branding-card
// GET  — 자사 브랜딩 카드 조회
// PUT  — 브랜딩 카드 최종 저장 (편집 내용 반영 + 공개)
// DELETE — 브랜딩 카드 삭제

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import type { BrandingCardStatus } from "@/prisma/generated/prisma/client";

// ── 기업 역할 + 기업 정보 확인 공통 헬퍼 ──

async function requireCorporation(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      corporation: { select: { id: true } },
    },
  });

  if (!user) return { corporation: null, err: error("USER_NOT_FOUND") };
  if (!user.role) return { corporation: null, err: error("ROLE_NOT_SET") };
  if (user.role !== "CORPORATION")
    return { corporation: null, err: error("ROLE_MISMATCH") };
  if (!user.corporation)
    return { corporation: null, err: error("CORPORATION_NOT_FOUND") };

  return { corporation: user.corporation, err: null };
}

// ────────────────────────────────────────
// GET /api/corporation/branding-card
// 자사 브랜딩 카드 조회
// ────────────────────────────────────────

export async function GET() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  try {
    const { corporation, err } = await requireCorporation(userId);
    if (err) return err;

    const card = await prisma.brandingCard.findUnique({
      where: { corporationId: corporation!.id },
      include: {
        keywords: { select: { id: true, keyword: true } },
      },
    });

    if (!card) return error("BRANDING_CARD_NOT_FOUND");

    return success({
      id: card.id,
      catchphrase: card.catchphrase,
      description: card.description,
      keywords: card.keywords.map((k) => k.keyword),
      backgroundStyle: card.backgroundStyle,
      backgroundUrl: card.backgroundUrl,
      thumbnailUrl: card.thumbnailUrl,
      thumbnailSource: card.thumbnailSource,
      status: card.status,
      prompt: card.prompt,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    });
  } catch {
    return error("DB_ERROR");
  }
}

// ────────────────────────────────────────
// PUT /api/corporation/branding-card
// 브랜딩 카드 최종 저장 (편집 내용 반영)
// ────────────────────────────────────────

interface UpdateBrandingCardRequest {
  catchphrase?: string;
  description?: string;
  keywords?: string[];
  backgroundStyle?: string;
  backgroundUrl?: string | null;
  thumbnailUrl?: string | null;
  thumbnailSource?: string;
  status?: string;
}

export async function PUT(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  const body = await parseBody<UpdateBrandingCardRequest>(request);
  if (!body) return error("INVALID_JSON");

  try {
    const { corporation, err } = await requireCorporation(userId);
    if (err) return err;

    // 기존 카드 확인
    const existing = await prisma.brandingCard.findUnique({
      where: { corporationId: corporation!.id },
    });

    if (!existing) return error("BRANDING_CARD_NOT_FOUND");

    // 유효성 검증
    if (body.catchphrase !== undefined && body.catchphrase.length > 40) {
      return error("VALIDATION_ERROR", "캐치프레이즈는 40자 이내여야 합니다.");
    }
    if (body.description !== undefined && body.description.length > 100) {
      return error("VALIDATION_ERROR", "기업 소개는 100자 이내여야 합니다.");
    }
    if (body.backgroundStyle !== undefined) {
      const validStyles = ["navy", "green", "purple", "black", "custom"];
      if (!validStyles.includes(body.backgroundStyle)) {
        return error("VALIDATION_ERROR", "유효하지 않은 배경 스타일입니다.");
      }
    }
    if (body.status !== undefined) {
      const validStatuses = ["DRAFT", "PUBLISHED"];
      if (!validStatuses.includes(body.status)) {
        return error("VALIDATION_ERROR", "유효하지 않은 상태 값입니다.");
      }
    }

    // 업데이트할 필드 조립
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (body.catchphrase !== undefined) updateData.catchphrase = body.catchphrase.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.backgroundStyle !== undefined) updateData.backgroundStyle = body.backgroundStyle;
    if (body.backgroundUrl !== undefined) updateData.backgroundUrl = body.backgroundUrl;
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl;
    if (body.thumbnailSource !== undefined) updateData.thumbnailSource = body.thumbnailSource;
    if (body.status !== undefined) updateData.status = body.status as BrandingCardStatus;

    // 변경 사항이 없으면
    if (Object.keys(updateData).length === 0 && !body.keywords) {
      return error("VALIDATION_ERROR", "수정할 항목이 없습니다.");
    }

    const card = await prisma.brandingCard.update({
      where: { id: existing.id },
      data: updateData,
    });

    // 키워드 교체 (전달된 경우만)
    if (body.keywords) {
      await prisma.brandingKeyword.deleteMany({
        where: { brandingCardId: card.id },
      });

      const keywords = body.keywords.slice(0, 5);
      if (keywords.length > 0) {
        await prisma.brandingKeyword.createMany({
          data: keywords.map((keyword) => ({
            brandingCardId: card.id,
            keyword: keyword.replace(/^#/, ""),
          })),
        });
      }
    }

    // 최종 결과 조회
    const updated = await prisma.brandingCard.findUnique({
      where: { id: card.id },
      include: {
        keywords: { select: { keyword: true } },
      },
    });

    return success({
      id: updated!.id,
      catchphrase: updated!.catchphrase,
      description: updated!.description,
      keywords: updated!.keywords.map((k) => k.keyword),
      backgroundStyle: updated!.backgroundStyle,
      backgroundUrl: updated!.backgroundUrl,
      thumbnailUrl: updated!.thumbnailUrl,
      thumbnailSource: updated!.thumbnailSource,
      status: updated!.status,
      updatedAt: updated!.updatedAt.toISOString(),
    });
  } catch {
    return error("DB_ERROR");
  }
}

// ────────────────────────────────────────
// DELETE /api/corporation/branding-card
// 브랜딩 카드 삭제
// ────────────────────────────────────────

export async function DELETE() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  try {
    const { corporation, err } = await requireCorporation(userId);
    if (err) return err;

    const existing = await prisma.brandingCard.findUnique({
      where: { corporationId: corporation!.id },
    });

    if (!existing) return error("BRANDING_CARD_NOT_FOUND");

    await prisma.brandingCard.delete({
      where: { id: existing.id },
    });

    return success({ id: existing.id, deleted: true });
  } catch {
    return error("DB_ERROR");
  }
}
