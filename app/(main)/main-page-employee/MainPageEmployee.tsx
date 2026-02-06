import React from "react";
import "./MainPageEmployee.css";
import RecruitmentCard from "@/components/layout/RecruitmentCard";

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
              <RecruitmentCard key={it.id} {...it} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
