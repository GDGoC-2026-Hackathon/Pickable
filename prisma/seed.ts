/**
 * 기업·채용 공고 더미 데이터 시드
 * 실행: npm run db:seed (또는 npx prisma db seed)
 */

import "dotenv/config";
import { prisma } from "../lib/db";

const DUMMY_EMAIL_PREFIX = "dummy-corp-seed@pickable.local";

async function main() {
  console.log("🌱 시드 시작: 기업·공고 더미 데이터 생성\n");

  // 기존 시드용 더미 유저 정리 (동일 이메일 패턴)
  const existing = await prisma.user.findMany({
    where: { email: { startsWith: "dummy-corp-seed" } },
    select: { id: true, corporation: { select: { id: true } } },
  });
  if (existing.length > 0) {
    console.log("기존 시드 더미 유저/기업이 있어 건너뜁니다.");
    const corpIds = existing.map((u) => u.corporation?.id).filter(Boolean) as string[];
    if (corpIds.length > 0) {
      await prisma.jobPosting.deleteMany({ where: { corporationId: { in: corpIds } } });
      await prisma.companyTag.deleteMany({ where: { corporationId: { in: corpIds } } });
      await prisma.corporation.deleteMany({ where: { id: { in: corpIds } } });
    }
    await prisma.user.deleteMany({
      where: { email: { startsWith: "dummy-corp-seed" } },
    });
    console.log("기존 시드 데이터 삭제 완료.\n");
  }

  const companies: Array<{
    name: string;
    industry: string;
    address: string;
    companySize: "STARTUP" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
    description: string | null;
    tags: string[];
    postings: Array<{
      title: string;
      jobTrack: string;
      status: "OPEN" | "CLOSED";
      minEducationLevel: "HIGH_SCHOOL" | "ASSOCIATE" | "BACHELOR" | "MASTER" | "DOCTORATE";
      deadline: Date | null;
      preferredCondition: string | null;
      salaryRange:
        | "RANGE_2400_3000"
        | "RANGE_3000_3600"
        | "RANGE_3600_4200"
        | "RANGE_4200_5000"
        | "OVER_5000"
        | null;
      salaryDescription: string | null;
      location: string | null;
      workStart: string | null;
      workEnd: string | null;
      skills: string[];
    }>;
  }> = [
    {
      name: "클라우드 펄스",
      industry: "IT · SaaS",
      address: "서울특별시 강남구 테헤란로 152 강남파이낸스센터 12층",
      companySize: "MEDIUM",
      description: "SaaS 전문 강소기업, 클라우드 인프라 솔루션",
      tags: ["핀테크", "유니콘", "시리즈D"],
      postings: [
        {
          title: "Front-end Engineer",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-03-20"),
          preferredCondition: "경력 3년 이상",
          salaryRange: "RANGE_4200_5000",
          salaryDescription: "4000만원 이상 (경력에 따라 협의)",
          location: "광화문",
          workStart: "09:00",
          workEnd: "18:00",
          skills: ["React", "TypeScript", "Next.js"],
        },
        {
          title: "Backend Engineer",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-03-31"),
          preferredCondition: "경력 2년 이상",
          salaryRange: "RANGE_3600_4200",
          salaryDescription: null,
          location: "광화문",
          workStart: "09:00",
          workEnd: "18:00",
          skills: ["Java", "Spring", "AWS"],
        },
      ],
    },
    {
      name: "데이터웨이브",
      industry: "데이터 · AI",
      address: "경기도 성남시 분당구 판교역로 235 에코타워 7층",
      companySize: "SMALL",
      description: "데이터 파이프라인 및 AI 솔루션 스타트업",
      tags: ["AI", "빅데이터", "스타트업"],
      postings: [
        {
          title: "Data Engineer",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-04-15"),
          preferredCondition: "경력 1년 이상, Python/Spark 경험",
          salaryRange: "RANGE_3000_3600",
          salaryDescription: "면접 후 결정",
          location: "판교",
          workStart: "10:00",
          workEnd: "19:00",
          skills: ["Python", "SQL", "Spark", "AWS"],
        },
        {
          title: "ML Engineer",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "MASTER",
          deadline: new Date("2025-04-30"),
          preferredCondition: "석사 이상, NLP/추천 시스템 경험",
          salaryRange: "OVER_5000",
          salaryDescription: "5,000만원 이상 (경력 협의)",
          location: "판교",
          workStart: "10:00",
          workEnd: "19:00",
          skills: ["Python", "PyTorch", "TensorFlow"],
        },
      ],
    },
    {
      name: "그린핸드",
      industry: "이커머스 · 소비재",
      address: "서울특별시 마포구 와우산로 29길 48",
      companySize: "STARTUP",
      description: "친환경 소비재 브랜드, D2C 이커머스",
      tags: ["이커머스", "D2C", "ESG"],
      postings: [
        {
          title: "Full-stack Developer",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-03-25"),
          preferredCondition: "신입 가능, 포트폴리오 우대",
          salaryRange: "RANGE_2400_3000",
          salaryDescription: "2,800만원 ~ 3,200만원",
          location: "홍대",
          workStart: "09:30",
          workEnd: "18:30",
          skills: ["Node.js", "React", "PostgreSQL"],
        },
        {
          title: "Product Designer",
          jobTrack: "디자인 트랙",
          status: "CLOSED",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-02-28"),
          preferredCondition: "경력 2년 이상",
          salaryRange: "RANGE_3000_3600",
          salaryDescription: null,
          location: "홍대",
          workStart: "09:30",
          workEnd: "18:30",
          skills: ["Figma", "UI/UX"],
        },
      ],
    },
    {
      name: "핀테크넥스트",
      industry: "금융 · 핀테크",
      address: "서울특별시 영등포구 여의대로 108 파크원 타워 2 15층",
      companySize: "LARGE",
      description: "금융 API·결제 인프라 제공",
      tags: ["핀테크", "시리즈C", "금융"],
      postings: [
        {
          title: "Backend Engineer (결제)",
          jobTrack: "기술/개발 트랙",
          status: "OPEN",
          minEducationLevel: "BACHELOR",
          deadline: new Date("2025-04-10"),
          preferredCondition: "경력 3년 이상, 결제/정산 도메인 경험",
          salaryRange: "OVER_5000",
          salaryDescription: "5,000만원 ~ 7,000만원",
          location: "여의도",
          workStart: "09:00",
          workEnd: "18:00",
          skills: ["Java", "Kotlin", "PostgreSQL", "Kafka"],
        },
      ],
    },
  ];

  for (let i = 0; i < companies.length; i++) {
    const corp = companies[i];
    const email = `${DUMMY_EMAIL_PREFIX}-${i + 1}`;

    const user = await prisma.user.create({
      data: {
        name: `${corp.name} (시드)`,
        email,
        role: "CORPORATION",
      },
    });

    const corporation = await prisma.corporation.create({
      data: {
        userId: user.id,
        name: corp.name,
        industry: corp.industry,
        address: corp.address,
        companySize: corp.companySize,
        description: corp.description,
        tags: {
          create: corp.tags.map((tagName) => ({ tagName })),
        },
      },
    });

    for (const job of corp.postings) {
      const posting = await prisma.jobPosting.create({
        data: {
          corporationId: corporation.id,
          title: job.title,
          jobTrack: job.jobTrack,
          status: job.status,
          minEducationLevel: job.minEducationLevel,
          deadline: job.deadline,
          preferredCondition: job.preferredCondition,
          salaryRange: job.salaryRange,
          salaryDescription: job.salaryDescription,
          location: job.location,
          workStart: job.workStart,
          workEnd: job.workEnd,
          skills: {
            create: job.skills.map((skillName) => ({ skillName })),
          },
        },
      });
      console.log(`  ✓ ${corp.name}: ${posting.title} (${posting.status})`);
    }

    console.log(`  → ${corp.name} (기업 + ${corp.postings.length}개 공고)\n`);
  }

  console.log("✅ 시드 완료: 기업·공고 더미 데이터가 생성되었습니다.");
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
