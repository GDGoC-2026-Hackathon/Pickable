// Edge 호환 인증 설정 (미들웨어에서 사용)
// Prisma 등 Node.js 전용 모듈 미포함

import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Cloud Run 등 리버스 프록시 뒤에서 동작 시 필수
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
	    // 미들웨어 인증 판단
	    authorized({ auth, request: { nextUrl } }) {
	      const isLoggedIn = !!auth?.user;
	      const isOnLogin = nextUrl.pathname.startsWith("/login");
	      const isApiRoute = nextUrl.pathname.startsWith("/api");
	      const isPublicRoute =
	        nextUrl.pathname === "/" ||
	        nextUrl.pathname === "" ||
	        nextUrl.pathname.startsWith("/onboarding");

	      if (isApiRoute || isPublicRoute) return true;
	      if (isOnLogin) {
	        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
	        return true;
	      }
	      return isLoggedIn;
	    },
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
