// 채용 공고 폼 셀렉트 옵션 (라벨 매핑)

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "HIGH_SCHOOL", label: "고등학교 졸업" },
  { value: "ASSOCIATE", label: "전문대 졸업" },
  { value: "BACHELOR", label: "대학교 졸업(학사)" },
  { value: "MASTER", label: "대학원 졸업(석사)" },
  { value: "DOCTORATE", label: "대학원 졸업(박사)" },
] as const;

export const FILTER_POLICY_OPTIONS = [
  { value: "NOT_RELEVANT", label: "무관" },
  { value: "REQUIRED", label: "필수" },
  { value: "BONUS", label: "가산점 부여" },
  { value: "NOT_REFLECTED", label: "미반영" },
] as const;

export const SALARY_RANGE_OPTIONS = [
  { value: "UNDER_2400", label: "2,400만원 미만" },
  { value: "RANGE_2400_3000", label: "2,400만원 ~ 3,000만원" },
  { value: "RANGE_3000_3600", label: "3,000만원 ~ 3,600만원" },
  { value: "RANGE_3600_4200", label: "3,600만원 ~ 4,200만원" },
  { value: "RANGE_4200_5000", label: "4,200만원 ~ 5,000만원" },
  { value: "OVER_5000", label: "5,000만원 이상" },
] as const;

export const POSTING_STATUS_OPTIONS = [
  { value: "OPEN", label: "채용 중" },
  { value: "CLOSED", label: "마감" },
] as const;

export const JOB_TRACK_EXAMPLES = [
  "기술/개발 트랙",
  "기획/PM 트랙",
  "디자인 트랙",
  "마케팅/영업 트랙",
  "인사/총무 트랙",
] as const;
