// Prisma 클라이언트 싱글턴
// - TCP 연결(개발): sslmode 제거 후 ssl 옵션으로 제어
// - Unix 소켓(Cloud Run → Cloud SQL): SSL 불필요

import { Pool, PoolConfig } from "pg";
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

function isUnixSocket(url: string): boolean {
  return url.includes("/cloudsql/");
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL!;
  const connectionString = stripSslMode(raw);

  const poolConfig: PoolConfig = { connectionString };

  // Unix 소켓(Cloud SQL)이 아닌 TCP 연결에서만 SSL 사용
  if (!isUnixSocket(raw)) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = globalForPrisma.pgPool ?? new Pool(poolConfig);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
