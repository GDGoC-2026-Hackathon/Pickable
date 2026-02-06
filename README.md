# Pickable🍎: 지원자가 Pick하고 싶은 회사로 
중소기업이 **선택받는 기업**이 되도록 AI로 브랜딩하고, 취준생의 정보 비대칭을 줄여 기업-인재를 매칭하는 플랫폼

<br>

## 문제 정의
취업난은 단순히 일자리가 부족한 문제가 아니라, 기업과 구직자가 서로를 충분히 검증하지 못하는 **정보 비대칭**에서 발생한다. 특히 취업 준비생들은 중소기업에 대한 신뢰할 수 있는 정보를 얻기 어렵고, 기업이 제공하는 채용 공고 역시 단편적이거나 정리되지 않은 경우가 많아 기업의 실제 가치와 성장 가능성을 파악하기 힘들다. 반면 중소기업 역시 기업 문화, 성장 경로, 인재상 등 핵심 정보를 효과적으로 전달할 수 있는 수단이 부족해 적합한 인재와 연결되지 못하는 구조적 한계를 겪고 있다.

## 서비스 아이디어
서비스 아이디어는 ‘취업난’이라는 사회 문제를 [검증, 실전, 전략, 멘탈] 네 가지 관점 중 **‘전략’**의 시각에서 접근하였다.

현재 취업 시장에서는 취준생들이 일자리 부족을 호소하고 있지만, 동시에 중소기업과 스타트업은 지원자 부족으로 인재 확보에 어려움을 겪는 구조적 불균형이 존재한다. 이러한 현상은 취준생들이 상대적으로 안정성과 보상이 높다고 인식되는 중견·대기업에 지원이 집중되면서 발생한다.

그러나 실제로는 중소기업과 스타트업 중에도 성장 가능성과 커리어 기회가 충분한 양질의 일자리가 존재한다. 문제는 이러한 기업 정보가 체계적으로 전달되지 않아 취준생들이 기업의 실질적인 가치와 성장성을 판단하기 어렵다는 점이다.

본 서비스는 이러한 정보 격차에서 발생하는 취업 시장의 비효율을 해결하기 위해, 중소기업의 브랜딩 강화와 채용 전략 컨설팅을 지원하는 플랫폼을 제안한다. 이를 통해 기업은 우수 인재에게 효과적으로 도달하고, 취준생은 보다 전략적인 커리어 선택을 할 수 있도록 돕고자 한다.

<br>

## 타겟 사용자
양방향 플랫폼으로, 두 종류의 유저가 있습니다.

1. 희망 직군과 현재 스킬을 기반으로 자신에게 맞는 **중소기업을 추천**받고 싶은 취업 준비생
2. 취준생들에게 기업을 효과적으로 알리고 **적합한 인재를 유입**하고 싶은 중소기업(기업 담당자)

## 해결책 요약
중소기업과 취업 준비생의 원활한 정보 교류와 추천을 바탕으로 적절한 매칭이 이루어지도록 합니다. 기업은 업종, 주소 등 기본 정보와 전공 계열·기술 스택 같은 근무 조건을 입력하고, 이를 바탕으로 기업의 강점을 부각한 **브랜딩 카드(포트폴리오 카드)**를 생성합니다. 취준생은 선호 근무 조건을 입력해 추천 리스트를 받고, 기업 카드(브랜딩/공고)를 훑으며 기업 정보를 비교·검증하고 선호 기업을 저장합니다. 결과적으로 “중소기업을 선택할 근거”와 “기업이 매력적으로 보이는 표현”을 함께 제공해 정보 비대칭을 완화합니다.

<br>

## 차별점

- 대부분의 채용 플랫폼에서 상대적으로 덜 다뤄지는 **중소기업**을 타겟팅
- 기업별 장점을 AI로 극대화하는 **중소기업 브랜딩 카드** 제공
- 취준생 유형별 맞춤 추천을 통한 **적합한 공고 큐레이션**

<br>



## 기술 스택 / 아키텍처
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white"/> <img src="https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white"/> <img src="https://img.shields.io/badge/Google Cloud-4285F4?style=flat-square&logo=Google Cloud&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> 

- **Frontend / Server**: Next.js 16 (App Router), React, TypeScript  
  - Server Component + Route Handler 기반 단일 코드베이스
- **DB / ORM**: PostgreSQL (Google Cloud SQL), Prisma ORM  
  - 타입 안정성 + 마이그레이션 기반 스키마 관리
- **Auth**: NextAuth (Google OAuth)
- **배포 / 인프라**: Docker 이미지 빌드 → Google Cloud Build → Cloud Run 배포  
  - 서버리스 구조로 운영 부담 최소화

  <br>

## 기능 정리

### 공통

- Google OAuth 로그인/회원가입
- 온보딩(역할 선택 및 프로필/기업 정보 등록)

### 기업(Company)

- 기업 정보 등록/수정
- AI 브랜딩 카드 생성/편집(결과 페이지)
- 채용 공고 등록/수정/삭제
- 공고 리스트/관리

### 취준생(Job Seeker)

- 취준생 프로필 등록/수정(근무 조건, 스킬 등)
- 맞춤형 공고 큐레이션(카드 UI)
- 마이페이지(최근 지원, 캘린더, 가이드 위젯 등)

<br>

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