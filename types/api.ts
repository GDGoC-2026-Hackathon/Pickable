// API 공통 타입 정의
// 모든 API 응답은 이 형식을 따릅니다

// 성공 응답
export type ApiResponse<T = unknown> = {
  data: T;
};

// 에러 응답
export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

// 페이지네이션 응답 (목록 조회용)
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
