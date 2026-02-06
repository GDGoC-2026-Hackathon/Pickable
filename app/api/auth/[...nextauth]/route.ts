// NextAuth API 라우트 핸들러
// /api/auth/* 경로로 들어오는 인증 요청을 처리

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
