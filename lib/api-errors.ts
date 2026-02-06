// 공통 에러 코드 정의
// API 전체에서 동일한 에러 코드와 HTTP 상태 코드를 사용합니다

export const API_ERRORS = {
  // 400 - 잘못된 요청
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    message: "입력값이 올바르지 않습니다.",
  },
  INVALID_JSON: {
    code: "INVALID_JSON",
    status: 400,
    message: "잘못된 JSON 형식입니다.",
  },

  // 401 - 인증 필요
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    status: 401,
    message: "로그인이 필요합니다.",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    status: 401,
    message: "인증이 만료되었습니다. 다시 로그인해주세요.",
  },

  // 403 - 권한 없음
  FORBIDDEN: {
    code: "FORBIDDEN",
    status: 403,
    message: "접근 권한이 없습니다.",
  },

  // 404 - 리소스 없음
  NOT_FOUND: {
    code: "NOT_FOUND",
    status: 404,
    message: "요청한 리소스를 찾을 수 없습니다.",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    status: 404,
    message: "사용자를 찾을 수 없습니다.",
  },
  CORPORATION_NOT_FOUND: {
    code: "CORPORATION_NOT_FOUND",
    status: 404,
    message: "기업 정보를 찾을 수 없습니다. 기업 등록을 먼저 완료해주세요.",
  },
  JOB_POSTING_NOT_FOUND: {
    code: "JOB_POSTING_NOT_FOUND",
    status: 404,
    message: "채용 공고를 찾을 수 없습니다.",
  },

  // 409 - 충돌
  CONFLICT: {
    code: "CONFLICT",
    status: 409,
    message: "이미 존재하는 데이터입니다.",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    status: 409,
    message: "이미 등록된 이메일입니다.",
  },
  ROLE_ALREADY_SET: {
    code: "ROLE_ALREADY_SET",
    status: 409,
    message: "이미 역할이 설정되어 있습니다.",
  },
  PROFILE_ALREADY_EXISTS: {
    code: "PROFILE_ALREADY_EXISTS",
    status: 409,
    message: "이미 프로필이 등록되어 있습니다.",
  },

  // 422 - 처리 불가
  ROLE_NOT_SET: {
    code: "ROLE_NOT_SET",
    status: 422,
    message: "역할을 먼저 선택해주세요.",
  },
  ROLE_MISMATCH: {
    code: "ROLE_MISMATCH",
    status: 422,
    message: "선택한 역할과 일치하지 않는 요청입니다.",
  },

  BRANDING_CARD_NOT_FOUND: {
    code: "BRANDING_CARD_NOT_FOUND",
    status: 404,
    message: "브랜딩 카드를 찾을 수 없습니다.",
  },

  // 500 - 서버 오류
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "서버 내부 오류가 발생했습니다.",
  },
  DB_ERROR: {
    code: "DB_ERROR",
    status: 500,
    message: "데이터베이스 오류가 발생했습니다.",
  },
  AI_GENERATION_ERROR: {
    code: "AI_GENERATION_ERROR",
    status: 500,
    message: "AI 콘텐츠 생성 중 오류가 발생했습니다.",
  },
  AI_RATE_LIMIT: {
    code: "AI_RATE_LIMIT",
    status: 429,
    message: "AI 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  },
} as const;

export type ApiErrorCode = keyof typeof API_ERRORS;
