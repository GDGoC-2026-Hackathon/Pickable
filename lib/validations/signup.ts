// 회원가입 유효성 검증
// 외부 라이브러리 없이 순수 타입 가드 + 검증 함수 사용

import type {
  JobSeekerSignupRequest,
  CorporationSignupRequest,
  ExperienceInput,
  CredentialInput,
} from "@/types/signup";

type ValidationOk<T> = { ok: true; data: T };
type ValidationFail = { ok: false; message: string };
type ValidationResult<T> = ValidationOk<T> | ValidationFail;

const fail = (message: string): ValidationFail => ({ ok: false, message });

// ── Enum 허용값 ──

const USER_ROLES = ["JOB_SEEKER", "CORPORATION"] as const;
const EDUCATION_LEVELS = ["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "MASTER", "DOCTORATE"] as const;
const MILITARY_STATUSES = ["NOT_APPLICABLE", "COMPLETED", "EXEMPT", "SERVING", "NOT_COMPLETED"] as const;
const EMPLOYMENT_TYPES = ["FULL_TIME", "CONTRACT", "INTERN", "FREELANCE"] as const;
const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;
const SALARY_RANGES = ["UNDER_2400", "RANGE_2400_3000", "RANGE_3000_3600", "RANGE_3600_4200", "RANGE_4200_5000", "OVER_5000"] as const;
const EXPERIENCE_TYPES = ["ACTIVITY", "AWARD", "OVERSEAS", "VOLUNTEER"] as const;
const CREDENTIAL_TYPES = ["CERTIFICATE", "LANGUAGE"] as const;
const COMPANY_SIZES = ["STARTUP", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"] as const;

// ── 유틸 ──

function isEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
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

// ── 역할 선택 검증 ──

export function validateRole(body: unknown): ValidationResult<"JOB_SEEKER" | "CORPORATION"> {
  if (!body || typeof body !== "object") return fail("요청 본문이 비어있습니다.");

  const { role } = body as Record<string, unknown>;
  if (!isEnum(role, USER_ROLES)) {
    return fail("role은 JOB_SEEKER 또는 CORPORATION이어야 합니다.");
  }

  return { ok: true, data: role };
}

// ── 취준생 프로필 검증 ──

export function validateJobSeekerSignup(body: unknown): ValidationResult<JobSeekerSignupRequest> {
  if (!body || typeof body !== "object") return fail("요청 본문이 비어있습니다.");

  const b = body as Record<string, unknown>;

  // 필수 enum 필드
  if (!isEnum(b.educationLevel, EDUCATION_LEVELS)) return fail("educationLevel이 올바르지 않습니다.");
  if (!isEnum(b.militaryStatus, MILITARY_STATUSES)) return fail("militaryStatus가 올바르지 않습니다.");
  if (!isEnum(b.gender, GENDERS)) return fail("gender가 올바르지 않습니다.");

  // 필수 문자열 필드
  if (!isNonEmptyString(b.major)) return fail("major는 필수 항목입니다.");
  if (!isNonEmptyString(b.desiredJobRole)) return fail("desiredJobRole은 필수 항목입니다.");
  if (!isDateString(b.birthDate)) return fail("birthDate는 YYYY-MM-DD 형식이어야 합니다.");

  // 선택 enum 필드
  if (b.desiredSalaryRange !== undefined && !isEnum(b.desiredSalaryRange, SALARY_RANGES)) {
    return fail("desiredSalaryRange가 올바르지 않습니다.");
  }
  if (b.employmentType !== undefined && !isEnum(b.employmentType, EMPLOYMENT_TYPES)) {
    return fail("employmentType이 올바르지 않습니다.");
  }

  // 선택 시간 필드
  if (b.commuteStart !== undefined && !isTimeString(b.commuteStart)) {
    return fail("commuteStart는 HH:mm 형식이어야 합니다.");
  }
  if (b.commuteEnd !== undefined && !isTimeString(b.commuteEnd)) {
    return fail("commuteEnd는 HH:mm 형식이어야 합니다.");
  }

  // 배열 필드
  if (b.skills !== undefined) {
    if (!Array.isArray(b.skills) || !b.skills.every((s: unknown) => isNonEmptyString(s))) {
      return fail("skills는 문자열 배열이어야 합니다.");
    }
  }

  if (b.experiences !== undefined) {
    if (!Array.isArray(b.experiences)) return fail("experiences는 배열이어야 합니다.");
    for (const exp of b.experiences as unknown[]) {
      const result = validateExperience(exp);
      if (!result.ok) return result;
    }
  }

  if (b.credentials !== undefined) {
    if (!Array.isArray(b.credentials)) return fail("credentials는 배열이어야 합니다.");
    for (const cred of b.credentials as unknown[]) {
      const result = validateCredential(cred);
      if (!result.ok) return result;
    }
  }

  return { ok: true, data: b as unknown as JobSeekerSignupRequest };
}

function validateExperience(exp: unknown): ValidationResult<ExperienceInput> {
  if (!exp || typeof exp !== "object") return fail("experience 항목이 올바르지 않습니다.");
  const e = exp as Record<string, unknown>;

  if (!isEnum(e.type, EXPERIENCE_TYPES)) return fail("experience.type이 올바르지 않습니다.");
  if (!isNonEmptyString(e.title)) return fail("experience.title은 필수 항목입니다.");

  return { ok: true, data: e as unknown as ExperienceInput };
}

function validateCredential(cred: unknown): ValidationResult<CredentialInput> {
  if (!cred || typeof cred !== "object") return fail("credential 항목이 올바르지 않습니다.");
  const c = cred as Record<string, unknown>;

  if (!isEnum(c.type, CREDENTIAL_TYPES)) return fail("credential.type이 올바르지 않습니다.");
  if (!isNonEmptyString(c.name)) return fail("credential.name은 필수 항목입니다.");

  return { ok: true, data: c as unknown as CredentialInput };
}

// ── 기업 프로필 검증 ──

export function validateCorporationSignup(body: unknown): ValidationResult<CorporationSignupRequest> {
  if (!body || typeof body !== "object") return fail("요청 본문이 비어있습니다.");

  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.name)) return fail("name은 필수 항목입니다.");
  if (!isNonEmptyString(b.industry)) return fail("industry는 필수 항목입니다.");
  if (!isNonEmptyString(b.address)) return fail("address는 필수 항목입니다.");
  if (!isEnum(b.companySize, COMPANY_SIZES)) return fail("companySize가 올바르지 않습니다.");

  return { ok: true, data: b as unknown as CorporationSignupRequest };
}
