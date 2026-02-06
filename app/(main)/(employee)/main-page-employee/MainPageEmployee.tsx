import React from "react";
import "./MainPageEmployee.css";
import FlippableRecruitmentCard from "@/components/layout/FlippableRecruitmentCard";

export default function MainPageEmployee() {
  // UI 목업 데이터
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    companyName: "클라우드 펄스",
    companyDesc: "SaaS 전문 강소기업",
    matchRate: 98,
    hiringLabel: "채용 중",
    tags: ["핀테크", "유니콘", "시리즈D"],
    positionTitle: "Front-end Engineer",
    deadline: "2025.03.20",
    experience: "경력 3년 이상",
    location: "광화문",
    salary: "4000만원 이상",
    workTime: "09:00 ~ 18:00",
    liked: i % 4 === 0,
    image:
      i % 2 === 0
        ? gradient("0b63ff", "0b1220")
        : gradient("7c3aed", "111827"),
  }));

  return (
    <div className="mpe-page">
      {/* Main */}
      <main className="mpe-main">
        <div className="mpe-container">
          <div className="mpe-head">
            <div>
              <h1 className="mpe-title">맞춤형 기업 공고 전체보기</h1>
              <p className="mpe-subtitle">
                AI가 분석한 김지우 님의 커리어 패스에 맞는 모든 기업을 카드 형식으로 만나보세요.
              </p>
            </div>

            <div className="mpe-actions">
              <button className="mpe-action-btn" type="button">
                <span className="mpe-action-ico" aria-hidden="true">⎇</span>
                필터
              </button>
              <button className="mpe-action-btn" type="button">
                <span className="mpe-action-ico" aria-hidden="true">⇅</span>
                정렬
              </button>
            </div>
          </div>

          <section className="mpe-grid">
            {items.map((it) => (
              <FlippableRecruitmentCard
                key={it.id}
                flipOnHover
                side="back"
                front={{
                  variant: "preview",
                  companyName: it.companyName,
                  companyDesc: it.companyDesc,
                  matchRate: it.matchRate,
                  tags: it.tags,
                  image: it.image,
                }}
                back={{
                  variant: "back",
                  companyName: it.companyName,
                  companyDesc: it.companyDesc,
                  matchRate: it.matchRate,
                  hiringLabel: it.hiringLabel,
                  tags: it.tags,
                  positionTitle: it.positionTitle,
                  deadline: it.deadline,
                  experience: it.experience,
                  location: it.location,
                  salary: it.salary,
                  workTime: it.workTime,
                  liked: it.liked,
                }}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

function gradient(colorA: string, colorB: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <radialGradient id="g1" cx="20%" cy="20%" r="90%">
        <stop offset="0%" stop-color="#${colorA}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="#${colorA}" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#${colorB}" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${colorB}"/>
        <stop offset="100%" stop-color="#${colorB}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g2)"/>
    <rect width="1200" height="800" fill="url(#g1)"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
