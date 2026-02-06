// AI 브랜딩 카드 생성용 프롬프트 빌더
// Corporation 프로필 데이터를 기반으로 Gemini 프롬프트를 조립합니다

// ── 타입 정의 ──

export interface CorporationForBranding {
  name: string;
  industry: string;
  companySize: string;
  description: string | null;
  welfare: string | null;
  homepageUrl: string | null;
  address: string;
  tags: { tagName: string }[];
  jobPostings: { title: string; jobTrack: string }[];
}

export interface BrandingCardResult {
  catchphrase: string;
  description: string;
  keywords: string[];
  backgroundStyle: string;
  brandingTip: string;
}

export interface RegenerateFieldResult {
  value: string | string[];
}

// ── 기업 규모 한글 매핑 ──

const COMPANY_SIZE_MAP: Record<string, string> = {
  STARTUP: "스타트업",
  SMALL: "중소기업",
  MEDIUM: "중견기업",
  LARGE: "대기업",
  ENTERPRISE: "대기업 그룹",
};

// ── 전체 브랜딩 카드 생성 프롬프트 ──

export function buildBrandingPrompt(
  corporation: CorporationForBranding,
  userPrompt?: string
): string {
  const companySize =
    COMPANY_SIZE_MAP[corporation.companySize] || corporation.companySize;
  const tags =
    corporation.tags.map((t) => t.tagName).join(", ") || "없음";
  const jobTitles =
    corporation.jobPostings.map((j) => j.title).join(", ") || "없음";

  return `당신은 중소기업 채용 브랜딩 전문 카피라이터입니다.
아래 기업 정보를 바탕으로 구직자(취준생)에게 매력적으로 어필할 수 있는
AI 브랜딩 카드 콘텐츠를 생성해주세요.

## 기업 정보
- 기업명: ${corporation.name}
- 업종: ${corporation.industry}
- 규모: ${companySize}
- 소재지: ${corporation.address}
- 소개: ${corporation.description || "없음"}
- 복리후생: ${corporation.welfare || "없음"}
- 홈페이지: ${corporation.homepageUrl || "없음"}
- 기업 태그: ${tags}
- 채용 중 직무: ${jobTitles}

${userPrompt ? `## 기업 담당자의 추가 요청\n${userPrompt}\n` : ""}
## 생성 규칙 (반드시 지키세요)
1. catchphrase: 반드시 한국어 40자 이내. 기업의 핵심 가치를 임팩트 있게 전달하는 슬로건. 이모지, 따옴표를 절대 포함하지 마세요.
2. description: 반드시 한국어 100자 이내. 구직자 관점에서 "이 회사에서 일하고 싶다"고 느끼게 하는 소개문. 이모지를 절대 포함하지 마세요.
3. keywords: 3~5개의 문자열 배열. 기업 문화/복지/강점을 핵심 키워드로 압축 (예: "자율출퇴근", "성장지원금"). '#' 기호와 이모지를 포함하지 마세요.
4. backgroundStyle: "navy", "green", "purple", "black" 중 기업 이미지에 가장 어울리는 것 1개.
5. brandingTip: 기업이 브랜딩 카드를 더 매력적으로 만들 수 있는 구체적 팁 1문장.

## 중요
- 이모지(emoji)를 절대 사용하지 마세요.
- 글자 수 제한을 반드시 지키세요 (catchphrase 40자, description 100자).
- 반드시 배열이 아닌 단일 JSON 객체로 출력하세요.

## 출력 형식 (단일 JSON 객체)
{
  "catchphrase": "string (40자 이내, 이모지 금지)",
  "description": "string (100자 이내, 이모지 금지)",
  "keywords": ["string", "string", "string"],
  "backgroundStyle": "navy | green | purple | black",
  "brandingTip": "string"
}

JSON 객체 1개만 출력하세요. 배열로 감싸지 마세요. 추가 설명은 포함하지 마세요.`;
}

// ── 개별 필드 재생성 프롬프트 ──

export function buildRegenerateFieldPrompt(
  field: "catchphrase" | "description" | "keywords",
  corporation: CorporationForBranding,
  currentCard: {
    catchphrase: string;
    description: string;
    keywords: string[];
  }
): string {
  const companySize =
    COMPANY_SIZE_MAP[corporation.companySize] || corporation.companySize;

  const fieldInstructions: Record<string, string> = {
    catchphrase: `새로운 메인 슬로건(catchphrase)을 생성하세요.
- 반드시 40자 이내
- 기존과 다른 톤/관점으로 작성
- 기업의 핵심 가치를 임팩트 있게 전달
- 따옴표를 포함하지 마세요

기존 슬로건 (이것과 다르게 작성): "${currentCard.catchphrase}"

출력 형식: { "value": "새 슬로건" }`,

    description: `새로운 기업 한 줄 소개(description)를 생성하세요.
- 반드시 100자 이내
- 기존과 다른 톤/관점으로 작성
- 구직자가 "이 회사에서 일하고 싶다"고 느끼게 하는 문장

기존 소개 (이것과 다르게 작성): "${currentCard.description}"

출력 형식: { "value": "새 소개문" }`,

    keywords: `새로운 핵심 키워드 해시태그를 생성하세요.
- 3~5개의 키워드
- 기존과 다른 관점의 키워드 포함
- 기업 문화/복지/강점을 핵심으로 압축
- '#' 기호를 포함하지 마세요

기존 키워드 (이것과 다르게 작성): ${currentCard.keywords.join(", ")}

출력 형식: { "value": ["키워드1", "키워드2", "키워드3"] }`,
  };

  return `당신은 중소기업 채용 브랜딩 전문 카피라이터입니다.

## 기업 정보
- 기업명: ${corporation.name}
- 업종: ${corporation.industry}
- 규모: ${companySize}
- 소개: ${corporation.description || "없음"}
- 복리후생: ${corporation.welfare || "없음"}

## 요청
${fieldInstructions[field]}

JSON만 출력하세요.`;
}
