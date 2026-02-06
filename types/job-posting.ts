// 채용 공고 API 요청/응답 타입

import type {
  EducationLevel,
  SalaryRange,
  FilterPolicy,
  PostingStatus,
} from "@/prisma/generated/prisma/client";

// ── 공고 수정 요청 (모든 필드 선택) ──

export type UpdateJobPostingRequest = {
  title?: string;
  jobTrack?: string;
  status?: PostingStatus;

  minEducationLevel?: EducationLevel;
  militaryPolicy?: FilterPolicy;
  careerPolicy?: FilterPolicy;

  deadline?: string | null;
  preferredCondition?: string | null;
  salaryRange?: SalaryRange | null;
  salaryDescription?: string | null;
  location?: string | null;
  workStart?: string | null;
  workEnd?: string | null;
  applicationUrl?: string | null;

  aiEvalCredential?: boolean;
  aiEvalExperience?: boolean;
  aiEvalAward?: boolean;

  skills?: string[];
};

// ── 공고 생성 요청 ──

export type CreateJobPostingRequest = {
  // 공고 기본 정보 (필수)
  title: string; // 뽑는 직무 (e.g. "Front-end Engineer")
  jobTrack: string; // 직무 트랙 (e.g. "기술/개발 트랙")

  // Hard Filter (필수)
  minEducationLevel: EducationLevel; // 필수 학력 요건
  militaryPolicy: FilterPolicy; // 병역 여부
  careerPolicy: FilterPolicy; // 직무 관련 경력

  // 조건 (선택)
  deadline?: string; // 마감일 "YYYY-MM-DD"
  preferredCondition?: string; // 우대조건
  salaryRange?: SalaryRange; // 급여 조건 (범위 선택)
  salaryDescription?: string; // 급여 조건 텍스트 (e.g. "면접 후 결정")
  location?: string; // 근무지
  workStart?: string; // 출근 시간 "HH:mm"
  workEnd?: string; // 퇴근 시간 "HH:mm"
  applicationUrl?: string; // 지원 링크

  // AI 정량 평가 항목 (선택, 기본값 false)
  aiEvalCredential?: boolean; // 자격증/어학
  aiEvalExperience?: boolean; // 대외/해외경험
  aiEvalAward?: boolean; // 수상 내역

  // 요구 기술 스택 (선택)
  skills?: string[];
};

// ── 기업 대시보드: 자사 공고 목록 조회 API 응답 ──

export type CorporationJobPostingListItem = {
  id: string;
  title: string;
  jobTrack: string;
  status: PostingStatus;
  deadline: string | null;
  daysLeft: number | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CorporationJobPostingsResponse = {
  data: CorporationJobPostingListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ── 공고 목록 응답 아이템 ──

export type JobPostingListItem = {
  id: string;
  title: string;
  status: PostingStatus;
  deadline: string | null;
  preferredCondition: string | null;
  salaryRange: SalaryRange | null;
  salaryDescription: string | null;
  location: string | null;
  workStart: string | null;
  workEnd: string | null;
  matchRate: number | null; // 매칭률 (인증된 취준생인 경우)
  createdAt: string;

  // 기업 정보 (조인)
  corporation: {
    id: string;
    name: string;
    description: string | null;
    thumbnailUrl: string | null;
    tags: string[];
  };
};

// ── 공고 상세 응답 ──

export type JobPostingDetail = {
  id: string;
  title: string;
  jobTrack: string;
  status: PostingStatus;

  // Hard Filter
  minEducationLevel: EducationLevel;
  militaryPolicy: FilterPolicy;
  careerPolicy: FilterPolicy;

  // 조건
  deadline: string | null;
  preferredCondition: string | null;
  salaryRange: SalaryRange | null;
  salaryDescription: string | null;
  location: string | null;
  workStart: string | null;
  workEnd: string | null;
  applicationUrl: string | null;

  // AI 평가
  aiEvalCredential: boolean;
  aiEvalExperience: boolean;
  aiEvalAward: boolean;

  // 기술 스택
  skills: string[];

  matchRate: number | null;
  createdAt: string;
  updatedAt: string;

  // 기업 정보
  corporation: {
    id: string;
    name: string;
    description: string | null;
    thumbnailUrl: string | null;
    industry: string;
    address: string;
    companySize: string;
    homepageUrl: string | null;
    tags: string[];
  };
};
