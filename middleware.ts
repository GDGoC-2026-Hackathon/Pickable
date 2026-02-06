// 인증 미들웨어
// matcher에 해당하는 경로는 로그인 필수, 나머지(api, 정적 파일, 로그인 페이지)는 제외

export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
