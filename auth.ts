// NextAuth 인증 설정
// Google OAuth + Prisma DB 어댑터

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login", // 커스텀 로그인 페이지 (필요 시 수정)
  },
  callbacks: {
    session({ session, user }) {
      // 세션에 사용자 ID 포함
      session.user.id = user.id;
      return session;
    },
  },
});
