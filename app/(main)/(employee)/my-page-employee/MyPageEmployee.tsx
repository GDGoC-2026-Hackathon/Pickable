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
  // UI 목업 데이터 (이미지는 public/ 아래 경로로 두면 편함)
  const previewItems: PreviewItem[] = [
    {
      id: "toss",
      companyName: "클라우드 펄스",
      companyDesc: "SaaS 전문 강소기업",
      matchRate: 98,
      tags: ["핀테크", "B2B"],
      image: gradient("0b63ff", "0b1220"),
      positionTitle: "Product Designer",
      deadline: "2025.03.20",
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
      image: gradient("7c3aed", "111827"),
      positionTitle: "Frontend Engineer",
      deadline: "2025.03.20",
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
      image: gradient("1fbf7a", "0b1220"),
      positionTitle: "UX Researcher",
      deadline: "2025.03.20",
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
      image: gradient("0b1220", "111827"),
      positionTitle: "Brand Marketer",
      deadline: "2025.03.20",
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
              <div className="mp-cal-title">2025.03</div>
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
              <h1 className="mp-head-title">김지우 님을 위한 맞춤 기업</h1>
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
