// POST /api/corporation/branding-card/generate
// Gemini AI를 이용해 기업 프로필 기반 브랜딩 카드 초안 생성

import { requireAuth } from "@/lib/auth-helpers";
import { success, error, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getBrandingModel, generateWithRetry, isRateLimitError } from "@/lib/gemini";
import {
  buildBrandingPrompt,
  type BrandingCardResult,
} from "@/lib/prompts/branding-card";

interface GenerateRequest {
  prompt?: string;
  /** 브랜딩 카드 제작 시 입력한 회사명 (있으면 프롬프트에 반영) */
  companyName?: string;
  /** 브랜딩 카드 제작 시 입력한 웹사이트 URL */
  companyUrl?: string;
  /** 브랜딩 카드 제작 시 입력한 회사 한줄 소개 */
  companyDesc?: string;
}

export async function POST(request: Request) {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return errorResponse;

  const userId = session!.user.id;

  // 요청 본문 파싱 (선택적 프롬프트)
  const body = await parseBody<GenerateRequest>(request);

  try {
    // 1. 기업 정보 조회 (프로필 + 태그 + 공고 포함)
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
          },
        },
      },
    });

    if (!user) return error("USER_NOT_FOUND");
    if (!user.role) return error("ROLE_NOT_SET");
    if (user.role !== "CORPORATION") return error("ROLE_MISMATCH");
    if (!user.corporation) return error("CORPORATION_NOT_FOUND");

    const corporation = user.corporation;

    // 2. Gemini 프롬프트 조립 (DB 기업 정보 + 제작 시 입력값 반영)
    const prompt = buildBrandingPrompt(corporation, body?.prompt, {
      companyName: body?.companyName?.trim() || undefined,
      companyUrl: body?.companyUrl?.trim() || undefined,
      companyDesc: body?.companyDesc?.trim() || undefined,
    });
    const model = await getBrandingModel();
    const responseText = await generateWithRetry(model, prompt);

    // 3. JSON 파싱 & 검증
    let parsed: BrandingCardResult;
    try {
      const raw = JSON.parse(responseText);
      // Gemini가 배열로 감싸서 반환하는 경우 대응
      parsed = Array.isArray(raw) ? raw[0] : raw;
    } catch {
      console.error("Gemini 응답 파싱 실패:", responseText);
      return error("AI_GENERATION_ERROR", "AI 응답을 파싱할 수 없습니다.");
    }

    // 기본 검증
    if (!parsed?.catchphrase || !parsed?.description || !parsed?.keywords) {
      console.error("Gemini 응답 필드 누락:", parsed);
      return error("AI_GENERATION_ERROR", "AI 응답에 필수 필드가 누락되었습니다.");
    }

    // 유효한 배경 스타일인지 확인
    const validStyles = ["navy", "green", "purple", "black"];
    if (!validStyles.includes(parsed.backgroundStyle)) {
      parsed.backgroundStyle = "navy"; // 기본값
    }

    // 4. DB에 DRAFT 상태로 upsert
    const card = await prisma.brandingCard.upsert({
      where: { corporationId: corporation.id },
      create: {
        corporationId: corporation.id,
        catchphrase: parsed.catchphrase.slice(0, 40),
        description: parsed.description.slice(0, 100),
        backgroundStyle: parsed.backgroundStyle,
        prompt: body?.prompt || null,
        status: "DRAFT",
      },
      update: {
        catchphrase: parsed.catchphrase.slice(0, 40),
        description: parsed.description.slice(0, 100),
        backgroundStyle: parsed.backgroundStyle,
        prompt: body?.prompt || null,
        status: "DRAFT",
      },
    });

    // 키워드 교체 (기존 삭제 후 재생성)
    await prisma.brandingKeyword.deleteMany({
      where: { brandingCardId: card.id },
    });

    const keywords = parsed.keywords.slice(0, 5);
    if (keywords.length > 0) {
      await prisma.brandingKeyword.createMany({
        data: keywords.map((keyword) => ({
          brandingCardId: card.id,
          keyword: keyword.replace(/^#/, ""), // # 제거
        })),
      });
    }

    return success(
      {
        id: card.id,
        catchphrase: card.catchphrase,
        description: card.description,
        keywords,
        backgroundStyle: card.backgroundStyle,
        brandingTip: parsed.brandingTip || null,
        status: card.status,
      },
      201
    );
  } catch (err) {
    console.error("브랜딩 카드 생성 오류:", err);

    // 429 Rate Limit → 사용자 친화적 메시지
    if (isRateLimitError(err)) {
      return error("AI_RATE_LIMIT");
    }

    return error("AI_GENERATION_ERROR");
  }
}
