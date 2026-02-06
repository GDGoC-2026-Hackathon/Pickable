# Next.js를 Cloud Run에 배포하기 위한 Dockerfile

# Stage 1: Dependencies 설치
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma 클라이언트 생성 (generated/는 .gitignore에 있어 빌드 시 생성 필요)
# prisma.config.ts가 DATABASE_URL을 참조하므로 이 단계에서만 더미 값 사용
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Next.js 빌드 (standalone 모드로 최적화)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: 프로덕션 런타임
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production

# 시스템 사용자 생성 (보안)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 빌드 결과물 복사
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run은 PORT 환경 변수를 사용 (기본 8080)
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
