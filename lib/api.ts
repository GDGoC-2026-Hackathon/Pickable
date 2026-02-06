// API 응답 헬퍼 함수
// Route Handler에서 일관된 형식으로 응답을 반환할 때 사용합니다
//
// 사용 예시:
//   return success(user)           → 200 + { data: user }
//   return success(user, 201)      → 201 + { data: user }
//   return error("NOT_FOUND")      → 404 + { error: { code, message } }
//   return error("VALIDATION_ERROR", "이메일 형식이 올바르지 않습니다.")

import { API_ERRORS, type ApiErrorCode } from "@/lib/api-errors";

// 성공 응답
export function success<T>(data: T, status: number = 200) {
  return Response.json({ data }, { status });
}

// 에러 응답 (등록된 에러 코드 사용)
export function error(errorCode: ApiErrorCode, message?: string) {
  const err = API_ERRORS[errorCode];
  return Response.json(
    {
      error: {
        code: err.code,
        message: message ?? err.message,
      },
    },
    { status: err.status }
  );
}

// JSON body 파싱 헬퍼 (잘못된 JSON 요청 시 에러 반환)
export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
