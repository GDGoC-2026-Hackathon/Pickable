// NextAuth 전체 설정 (Node.js 런타임)
// auth.config.ts + Prisma 어댑터

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";
import type { CorporationProfile } from "@/types/next-auth";

async function getUserRoleAndCorporation(
  userId: string
): Promise<{
  role: "JOB_SEEKER" | "CORPORATION" | null;
  corporation: CorporationProfile | null;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      corporation: {
        select: {
          id: true,
          name: true,
          thumbnailUrl: true,
          industry: true,
        },
      },
    },
  });

  const role = (user?.role as "JOB_SEEKER" | "CORPORATION") ?? null;

  if (user?.role !== "CORPORATION" || !user.corporation) {
    return { role, corporation: null };
  }

  return {
    role,
    corporation: {
      id: user.corporation.id,
      name: user.corporation.name,
      thumbnailUrl: user.corporation.thumbnailUrl,
      industry: user.corporation.industry,
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (user?.id) {
        const { role, corporation } = await getUserRoleAndCorporation(user.id);
        token.role = role;
        if (corporation) token.corporation = corporation;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "JOB_SEEKER" | "CORPORATION" | null) ?? null;
      }
      if (token.corporation)
        session.corporation = token.corporation as CorporationProfile;
      return session;
    },
  },
});
