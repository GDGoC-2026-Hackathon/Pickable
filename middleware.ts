// 인증 미들웨어 (Edge Runtime)

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // 정적 리소스(favicon.png, /icons/*)는 인증 미들웨어 제외 (배포 시 307 로그인 리다이렉트 방지)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon\\.png|openapi\\.yaml|icons/).*)"],
};
