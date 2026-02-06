# Pickable

2026년도 GDGoC 해커톤 레포지토리입니다.

## 기술 스택

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **ORM**: Prisma 7 (PostgreSQL)
- **Auth**: NextAuth.js (Google OAuth)
- **Database**: Google Cloud SQL (PostgreSQL 18)
- **Deployment**: Google Cloud Run
- **Runtime**: Node.js 20

### 로컬 개발

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션 적용
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### Prisma 명령어

```bash
# schema.prisma 수정 후 타입 클라이언트를 다시 생성할 때
npx prisma generate

# 스키마 변경 후 마이그레이션 파일을 만들고 DB에 적용할 때 (개발 환경)
npx prisma migrate dev --name 마이그레이션_이름

# 프로덕션 배포 시 마이그레이션을 적용할 때
npx prisma migrate deploy

# 빠르게 DB 스키마를 맞추고 싶을 때 (마이그레이션 파일 없이 바로 반영)
npx prisma db push

# 브라우저에서 DB 데이터를 직접 조회/수정할 때
npx prisma studio
```

### 빌드

```bash
npm run build
npm start
```
