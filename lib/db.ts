// Prisma 클라이언트 싱글턴
// pg의 sslmode=require가 verify-full로 해석되는 문제 방지를 위해
// connection string에서 sslmode를 제거하고 Pool 옵션으로 SSL 제어

import { Pool } from "pg";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function stripSslMode(url: string): string {
  return url
    .replace(/[?&]sslmode=[^&]*/g, "")
    .replace(/\?$/, "")
    .replace(/\?&/, "?");
}

function createPrismaClient() {
  const connectionString = stripSslMode(process.env.DATABASE_URL!);

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
