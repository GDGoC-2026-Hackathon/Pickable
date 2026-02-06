// 회원가입 API 요청/응답 타입

import type {
  UserRole,
  EducationLevel,
  MilitaryStatus,
  SalaryRange,
  EmploymentType,
  Gender,
  ExperienceType,
  CredentialType,
} from "@/prisma/generated/prisma/client";

// ── 역할 선택 ──

export type RoleSelectRequest = {
  role: UserRole;
};

export type SignupStatusResponse = {
  role: UserRole | null;
  hasProfile: boolean;
};

// ── 취준생 프로필 등록 ──

export type JobSeekerSignupRequest = {
  // Hard Filter (필수)
  educationLevel: EducationLevel;
  major: string;
  desiredJobRole: string;
  militaryStatus: MilitaryStatus;

  // 선호 조건 (선택)
  desiredLocation?: string;
  desiredSalaryRange?: SalaryRange;
  commuteStart?: string; // "HH:mm"
  commuteEnd?: string;
  employmentType?: EmploymentType;

  // 기본 정보 (필수)
  birthDate: string; // "YYYY-MM-DD"
  gender: Gender;

  // 서브 데이터 (선택)
  skills?: string[];
  experiences?: ExperienceInput[];
  credentials?: CredentialInput[];
};

export type ExperienceInput = {
  type: ExperienceType;
  title: string;
  description?: string;
  isJobRelated?: boolean;
};

export type CredentialInput = {
  type: CredentialType;
  name: string;
  score?: string;
};

// ── 기업 등록 ──

export type CorporationSignupRequest = {
  name: string;
  industry: string;
  address: string;
  companySize: string;

  // 선택
  thumbnailUrl?: string;
  description?: string;
  welfare?: string;
  homepageUrl?: string;
  phone?: string;
};
