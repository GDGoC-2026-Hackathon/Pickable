// Gemini AI 클라이언트 싱글턴
// - 브랜딩 카드 생성 등 AI 기능에서 공통으로 사용
// - 429 Rate Limit 대응 재시도 로직 포함

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerativeModel } from "@google/generative-ai";

const globalForGemini = globalThis as unknown as {
  geminiClient: GoogleGenerativeAI | undefined;
};

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
  }
  return new GoogleGenerativeAI(apiKey);
}

export const gemini =
  globalForGemini.geminiClient ?? createGeminiClient();

if (process.env.NODE_ENV !== "production") {
  globalForGemini.geminiClient = gemini;
}

// 브랜딩 카드 생성용 모델 (JSON 모드)
export function getBrandingModel() {
  return gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });
}

// ── 재시도 로직 (429 Rate Limit 대응) ──

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 2000; // 2초

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    return err.message.includes("429") || err.message.includes("Resource exhausted");
  }
  return false;
}

/**
 * Gemini API 호출 + 자동 재시도 (429 에러 시 지수 백오프)
 * @returns 생성된 텍스트 응답
 * @throws 재시도 횟수 초과 시 원본 에러 또는 GeminiRateLimitError
 */
export async function generateWithRetry(
  model: GenerativeModel,
  prompt: string
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;

      if (isRateLimitError(err) && attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
        console.warn(
          `Gemini 429 Rate Limit - ${attempt + 1}/${MAX_RETRIES} 재시도 (${delay}ms 후)`
        );
        await sleep(delay);
        continue;
      }

      // Rate Limit이 아닌 에러이거나, 재시도 횟수 초과
      throw err;
    }
  }

  throw lastError;
}

/** 429 에러인지 확인하는 유틸 (API 라우트에서 에러 메시지 분기용) */
export { isRateLimitError };
