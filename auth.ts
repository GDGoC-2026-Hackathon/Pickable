// NextAuth 전체 설정 (Node.js 런타임)
// auth.config.ts + Prisma 어댑터

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";
import type { CorporationProfile } from "@/types/next-auth";

async function getCorporationProfile(
  userId: string
): Promise<CorporationProfile | null> {
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
  if (user?.role !== "CORPORATION" || !user.corporation) return null;
  return {
    id: user.corporation.id,
    name: user.corporation.name,
    thumbnailUrl: user.corporation.thumbnailUrl,
    industry: user.corporation.industry,
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
        const corporation = await getCorporationProfile(user.id);
        if (corporation) token.corporation = corporation;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      if (token.corporation)
        session.corporation = token.corporation as CorporationProfile;
      return session;
    },
  },
});
