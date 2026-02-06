// 채용 공고 유효성 검증
// 외부 라이브러리 없이 순수 타입 가드 + 검증 함수 사용

import type { CreateJobPostingRequest } from "@/types/job-posting";

type ValidationOk<T> = { ok: true; data: T };
type ValidationFail = { ok: false; message: string };
type ValidationResult<T> = ValidationOk<T> | ValidationFail;

const fail = (message: string): ValidationFail => ({ ok: false, message });

// ── Enum 허용값 ──

const EDUCATION_LEVELS = [
  "HIGH_SCHOOL",
  "ASSOCIATE",
  "BACHELOR",
  "MASTER",
  "DOCTORATE",
] as const;

const FILTER_POLICIES = [
  "NOT_RELEVANT",
  "REQUIRED",
  "BONUS",
  "NOT_REFLECTED",
] as const;

const SALARY_RANGES = [
  "UNDER_2400",
  "RANGE_2400_3000",
  "RANGE_3000_3600",
  "RANGE_3600_4200",
  "RANGE_4200_5000",
  "OVER_5000",
] as const;

// ── 유틸 ──

function isEnum<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return (
    typeof value === "string" &&
    (allowed as readonly string[]).includes(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
function isTimeString(value: unknown): value is string {
  return typeof value === "string" && TIME_REGEX.test(value);
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
function isDateString(value: unknown): boolean {
  if (typeof value !== "string" || !DATE_REGEX.test(value)) return false;
  return !isNaN(Date.parse(value));
}

const URL_REGEX = /^https?:\/\/.+/;
function isValidUrl(value: unknown): boolean {
  return typeof value === "string" && URL_REGEX.test(value);
}

// ── 공고 생성 검증 ──

export function validateCreateJobPosting(
  body: unknown
): ValidationResult<CreateJobPostingRequest> {
  if (!body || typeof body !== "object")
    return fail("요청 본문이 비어있습니다.");

  const b = body as Record<string, unknown>;

  // 필수 문자열 필드
  if (!isNonEmptyString(b.title))
    return fail("title(뽑는 직무)은 필수 항목입니다.");
  if (!isNonEmptyString(b.jobTrack))
    return fail("jobTrack(직무 트랙)은 필수 항목입니다.");

  // 필수 enum 필드
  if (!isEnum(b.minEducationLevel, EDUCATION_LEVELS))
    return fail("minEducationLevel이 올바르지 않습니다.");
  if (!isEnum(b.militaryPolicy, FILTER_POLICIES))
    return fail("militaryPolicy가 올바르지 않습니다.");
  if (!isEnum(b.careerPolicy, FILTER_POLICIES))
    return fail("careerPolicy가 올바르지 않습니다.");

  // 선택 필드: 마감일
  if (b.deadline !== undefined && b.deadline !== null) {
    if (!isDateString(b.deadline))
      return fail("deadline은 YYYY-MM-DD 형식이어야 합니다.");
  }

  // 선택 필드: 급여 범위
  if (
    b.salaryRange !== undefined &&
    b.salaryRange !== null &&
    !isEnum(b.salaryRange, SALARY_RANGES)
  ) {
    return fail("salaryRange가 올바르지 않습니다.");
  }

  // 선택 필드: 시간
  if (b.workStart !== undefined && b.workStart !== null) {
    if (!isTimeString(b.workStart))
      return fail("workStart는 HH:mm 형식이어야 합니다.");
  }
  if (b.workEnd !== undefined && b.workEnd !== null) {
    if (!isTimeString(b.workEnd))
      return fail("workEnd는 HH:mm 형식이어야 합니다.");
  }

  // 선택 필드: 지원 링크 URL 검증
  if (b.applicationUrl !== undefined && b.applicationUrl !== null) {
    if (!isNonEmptyString(b.applicationUrl))
      return fail("applicationUrl이 비어있습니다.");
    if (!isValidUrl(b.applicationUrl))
      return fail("applicationUrl은 http:// 또는 https://로 시작해야 합니다.");
  }

  // 선택 필드: AI 평가 boolean
  if (
    b.aiEvalCredential !== undefined &&
    typeof b.aiEvalCredential !== "boolean"
  )
    return fail("aiEvalCredential은 boolean이어야 합니다.");
  if (
    b.aiEvalExperience !== undefined &&
    typeof b.aiEvalExperience !== "boolean"
  )
    return fail("aiEvalExperience는 boolean이어야 합니다.");
  if (b.aiEvalAward !== undefined && typeof b.aiEvalAward !== "boolean")
    return fail("aiEvalAward는 boolean이어야 합니다.");

  // 선택 필드: 기술 스택
  if (b.skills !== undefined) {
    if (
      !Array.isArray(b.skills) ||
      !b.skills.every((s: unknown) => isNonEmptyString(s))
    ) {
      return fail("skills는 비어있지 않은 문자열 배열이어야 합니다.");
    }
  }

  return { ok: true, data: b as unknown as CreateJobPostingRequest };
}
