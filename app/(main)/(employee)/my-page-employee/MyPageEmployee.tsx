'use client'

import { useSession } from 'next-auth/react'
import FlippableRecruitmentCard from "@/components/layout/FlippableRecruitmentCard";
import Link from 'next/link'

type PreviewItem = {
  id: string;
  companyName: string;
  companyDesc: string;
  matchRate: number;
  tags: string[];
  image: string; 
  positionTitle: string;
  deadline: string;
  experience: string;
  location: string;
  salary: string;
  workTime: string;
  hiringLabel: string;
};

export default function MyPageEmployee() {
  const { data: session } = useSession()
  const userName = session?.user?.name || session?.user?.email || '회원'

  // UI 목업 데이터 (카드 배경 이미지 URL)
  const previewItems: PreviewItem[] = [
    {
      id: "toss",
      companyName: "클라우드 펄스",
      companyDesc: "SaaS 전문 강소기업",
      matchRate: 98,
      tags: ["핀테크", "B2B"],
      image: "https://blog.kakaocdn.net/dna/BRper/btsPUZ4Ka3l/AAAAAAAAAAAAAAAAAAAAAA3gBEvInLIlxegJlmB-dHJWstD4g4Sb_3VfgDgUV9fd/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=ZK9xuJBlNec75aAZCYOReQxBBQA%3D",
      positionTitle: "Product Designer",
      deadline: "2026.02.20",
      experience: "경력 3년 이상",
      location: "서울 강남구",
      salary: "4000만원 이상",
      workTime: "09:00 ~ 18:00",
      hiringLabel: "채용 중",
    },
    {
      id: "karrot",
      companyName: "이지스퍼블리싱",
      companyDesc: "브랜드 경험을 설계합니다",
      matchRate: 95,
      tags: ["브랜딩", "UX/UI"],
      image: "https://imgs.jobkorea.co.kr/img3/_thumb/300x0/Company/Visual_Co/images/2020/1/JK_CO_easyspub_1.JPG",
      positionTitle: "Frontend Engineer",
      deadline: "2026.02.20",
      experience: "경력 2년 이상",
      location: "서울 성동구",
      salary: "면접 후 결정",
      workTime: "10:00 ~ 19:00",
      hiringLabel: "채용 중",
    },
    {
      id: "karrot-2",
      companyName: "VinSign",
      companyDesc: "데이터 기반 이커머스",
      matchRate: 95,
      tags: ["이커머스", "데이터"],
      image: "https://vinsign.app/vinsign.jpeg",
      positionTitle: "UX Researcher",
      deadline: "2026.02.20",
      experience: "경력 3년 이상",
      location: "서울 성동구",
      salary: "면접 후 결정",
      workTime: "10:00 ~ 19:00",
      hiringLabel: "채용 중",
    },
    {
      id: "musinsa",
      companyName: "넥스트 웨이브",
      companyDesc: "디지털 랩",
      matchRate: 92,
      tags: ["기술중심", "팀문화"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3FILbREuslMYdr2suLdKfuSdmP4JTyWtfLg&s",
      positionTitle: "Brand Marketer",
      deadline: "2026.02.20",
      experience: "경력 4년 이상",
      location: "서울 서초구",
      salary: "5000만원 이상",
      workTime: "09:30 ~ 18:30",
      hiringLabel: "채용 중",
    },
  ];

  return (
    <div className="mypage">
      <div className="mypage-container">
        {/* LEFT SIDEBAR */}
        <aside className="mypage-left">
          {/* Calendar */}
          <section className="mp-card">
            <div className="mp-cal-head">
              <div className="mp-cal-title">2026.02</div>
              <div className="mp-cal-nav" aria-hidden="true">
                <button className="mp-icon-btn" type="button">‹</button>
                <button className="mp-icon-btn" type="button">›</button>
              </div>
            </div>

            <div className="mp-cal-week">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="mp-cal-weekday">{d}</div>
              ))}
            </div>

            <div className="mp-cal-grid">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const active = day === 12;
                const dot = day === 20;
                const sunday = (i % 7) === 0;
                return (
                  <div
                    key={day}
                    className={[
                      "mp-cal-day",
                      active ? "is-active" : "",
                      sunday ? "is-sun" : "",
                    ].join(" ")}
                  >
                    {day}
                    {dot && <span className="mp-dot" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>

            <div className="mp-subtitle">오늘의 일정</div>

            <div className="mp-schedule">
              <div className="mp-schedule-item">
                <div className="mp-schedule-icon" aria-hidden="true">🎥</div>
                <div className="mp-schedule-body">
                  <div className="mp-schedule-time">14:00 - 15:00</div>
                  <div className="mp-schedule-text">클라우드 펄스 1차 면접</div>
                </div>
              </div>

              <div className="mp-schedule-item">
                <div className="mp-schedule-icon is-orange" aria-hidden="true">📄</div>
                <div className="mp-schedule-body">
                  <div className="mp-schedule-time">23:59 마감</div>
                  <div className="mp-schedule-text">모멘트 디자인 프로덕트 디자이너 서류</div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent applied */}
          <section className="mp-card">
            <div className="mp-row">
              <div className="mp-title">최근 지원한 공고</div>
              <button className="mp-link" type="button">전체 보기 →</button>
            </div>

            <div className="mp-recent">
              <div className="mp-recent-item">
                <div className="mp-recent-dot is-green" aria-hidden="true" />
                <div className="mp-recent-body">
                  <div className="mp-recent-company">클라우드 펄스</div>
                  <div className="mp-recent-meta">프로덕트 디자이너 · 서류 검토 중</div>
                </div>
                <button className="mp-ghost" type="button">상세 보기</button>
              </div>

              <div className="mp-recent-item">
                <div className="mp-recent-dot is-yellow" aria-hidden="true" />
                <div className="mp-recent-body">
                  <div className="mp-recent-company">모멘트 디자인</div>
                  <div className="mp-recent-meta">UX 리서처 · 과제 진행 중</div>
                </div>
                <button className="mp-ghost" type="button">과제 제출</button>
              </div>
            </div>
          </section>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="mypage-right">
          <div className="mp-head">
            <div>
              <h1 className="mp-head-title">{userName} 님을 위한 맞춤 기업</h1>
              <p className="mp-head-desc">
                AI가 분석한 커리어 패스에 맞는 큐레이션입니다.
              </p>
            </div>

            <Link className="mp-primary" href="/main-page-employee">전체 보기</Link>
          </div>

          <section className="mp-grid">
            {previewItems.map((it) => (
              <FlippableRecruitmentCard
                key={it.id}
                flipOnHover
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
                  liked: false,
                }}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
