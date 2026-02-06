// POST /api/corporation/branding-card/regenerate-field
// 브랜딩 카드의 특정 필드만 AI로 재생성

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getBrandingModel, generateWithRetry, isRateLimitError } from "@/lib/gemini";
import {
  buildRegenerateFieldPrompt,
  type RegenerateFieldResult,
} from "@/lib/prompts/branding-card";

type RegenerateField = "catchphrase" | "description" | "keywords";

interface RegenerateFieldRequest {
  field: RegenerateField;
}

const VALID_FIELDS: RegenerateField[] = [
  "catchphrase",
  "description",
  "keywords",
];

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  const body = await parseBody<RegenerateFieldRequest>(request);
  if (!body) return error("INVALID_JSON");

  // 필드 유효성 검증
  if (!body.field || !VALID_FIELDS.includes(body.field)) {
    return error(
      "VALIDATION_ERROR",
      `field는 ${VALID_FIELDS.join(", ")} 중 하나여야 합니다.`
    );
  }

  try {
    // 1. 기업 정보 + 기존 브랜딩 카드 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        corporation: {
          include: {
            tags: { select: { tagName: true } },
            jobPostings: {
              select: { title: true, jobTrack: true },
              where: { status: "OPEN" },
              take: 10,
            },
            brandingCard: {
              include: {
                keywords: { select: { keyword: true } },
              },
            },
          },
        },
      },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (!user.role) return error("ROLE_NOT_SET");
    if (user.role !== "CORPORATION") return error("ROLE_MISMATCH");
    if (!user.corporation) return error("CORPORATION_NOT_FOUND");
    if (!user.corporation.brandingCard) {
      return error(
        "BRANDING_CARD_NOT_FOUND",
        "브랜딩 카드를 먼저 생성해주세요."
      );
    }

    const corporation = user.corporation;
    const currentCard = corporation.brandingCard!;

    // 2. 프롬프트 조립 & Gemini 호출
    const prompt = buildRegenerateFieldPrompt(body.field, corporation, {
      catchphrase: currentCard.catchphrase,
      description: currentCard.description,
      keywords: currentCard.keywords.map((k) => k.keyword),
    });

    const model = await getBrandingModel();
    const responseText = await generateWithRetry(model, prompt);

    // 3. JSON 파싱
    let parsed: RegenerateFieldResult;
    try {
      const raw = JSON.parse(responseText);
      // Gemini가 배열로 감싸서 반환하는 경우 대응
      parsed = Array.isArray(raw) ? raw[0] : raw;
    } catch {
      console.error("Gemini 응답 파싱 실패:", responseText);
      return error("AI_GENERATION_ERROR", "AI 응답을 파싱할 수 없습니다.");
    }

    if (parsed.value === undefined || parsed.value === null) {
      return error("AI_GENERATION_ERROR", "AI 응답에 value 필드가 누락되었습니다.");
    }

    // 4. 필드별 DB 업데이트
    if (body.field === "keywords") {
      // 키워드 배열 처리
      const keywords = Array.isArray(parsed.value) ? parsed.value : [parsed.value];
      await prisma.brandingKeyword.deleteMany({
        where: { brandingCardId: currentCard.id },
      });
      await prisma.brandingKeyword.createMany({
        data: keywords.slice(0, 5).map((keyword) => ({
          brandingCardId: currentCard.id,
          keyword: String(keyword).replace(/^#/, ""),
        })),
      });

      return success({
        field: body.field,
        value: keywords.map((k) => String(k).replace(/^#/, "")),
      });
    } else {
      // catchphrase 또는 description
      const value = String(parsed.value);
      const maxLen = body.field === "catchphrase" ? 40 : 100;

      await prisma.brandingCard.update({
        where: { id: currentCard.id },
        data: { [body.field]: value.slice(0, maxLen) },
      });

      return success({
        field: body.field,
        value: value.slice(0, maxLen),
      });
    }
  } catch (err) {
    console.error("필드 재생성 오류:", err);

    if (isRateLimitError(err)) {
      return error("AI_RATE_LIMIT");
    }

    return error("AI_GENERATION_ERROR");
  }
}
