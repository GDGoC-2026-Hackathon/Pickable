// Gemini AI 클라이언트 싱글턴
// - 브랜딩 카드 생성 등 AI 기능에서 공통으로 사용
// - 429 Rate Limit 대응 재시도 로직 포함
//
// NOTE:
// 이 프로젝트 환경에서는 npm 레지스트리 접근이 막혀 있을 수 있어,
// @google/generative-ai 의 정적 import가 빌드를 깨뜨릴 수 있습니다.
// 그래서 "런타임에만" 모듈을 로드하도록 구성합니다.

export type GeminiModel = {
  generateContent: (prompt: string) => Promise<{
    response: { text: () => string }
  }>
}

type GeminiClient = {
  getGenerativeModel: (args: {
    model: string
    generationConfig?: {
      responseMimeType?: string
      temperature?: number
    }
  }) => GeminiModel
}

const globalForGemini = globalThis as unknown as {
  geminiClient: GeminiClient | undefined
}

async function createGeminiClient(): Promise<GeminiClient> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.')
  }

  const moduleName = '@google/generative-ai'
  try {
    // Turbopack/webpack이 모듈을 정적으로 해석하지 않도록 eval 기반 dynamic import 사용
    // eslint-disable-next-line no-eval
    const mod = (await (0, eval)(`import(${JSON.stringify(moduleName)})`)) as {
      GoogleGenerativeAI: new (key: string) => GeminiClient
    }
    return new mod.GoogleGenerativeAI(apiKey)
  } catch (err) {
    console.error('Gemini SDK 로드 실패:', err)
    throw new Error(
      `Gemini SDK(${moduleName})를 찾을 수 없습니다. "npm i ${moduleName}"로 설치하거나 해당 기능을 비활성화해주세요.`
    )
  }
}

async function getGeminiClient(): Promise<GeminiClient> {
  const existing = globalForGemini.geminiClient
  if (existing) return existing

  const created = await createGeminiClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForGemini.geminiClient = created
  }
  return created
}

// 브랜딩 카드 생성용 모델 (JSON 모드)
export async function getBrandingModel(): Promise<GeminiModel> {
  const gemini = await getGeminiClient()
  return gemini.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8,
    },
  })
}

// ── 재시도 로직 (429 Rate Limit 대응) ──

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 2000 // 2초

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    return (
      err.message.includes('429') || err.message.includes('Resource exhausted')
    )
  }
  return false
}

/**
 * Gemini API 호출 + 자동 재시도 (429 에러 시 지수 백오프)
 * @returns 생성된 텍스트 응답
 * @throws 재시도 횟수 초과 시 원본 에러
 */
export async function generateWithRetry(
  model: GeminiModel,
  prompt: string
): Promise<string> {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (err) {
      lastError = err

      if (isRateLimitError(err) && attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt) // 2s, 4s, 8s
        console.warn(
          `Gemini 429 Rate Limit - ${attempt + 1}/${MAX_RETRIES} 재시도 (${delay}ms 후)`
        )
        await sleep(delay)
        continue
      }

      throw err
    }
  }

  throw lastError
}

