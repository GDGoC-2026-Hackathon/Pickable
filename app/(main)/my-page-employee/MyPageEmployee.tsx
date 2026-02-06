import "./MyPageEmployee.css";
import RecruitmentCard from "@/components/layout/RecruitmentCard";
import Link from 'next/link'

type PreviewItem = {
  id: string;
  companyName: string;
  companyDesc: string;
  matchRate: number;
  tags: string[];
  image: string; // preview 배경 이미지
};

export default function MyPageEmployee() {
  // UI 목업 데이터 (이미지는 public/ 아래 경로로 두면 편함)
  const previewItems: PreviewItem[] = [
    {
      id: "toss",
      companyName: "토스 (Toss)",
      companyDesc: "금융의 모든 것",
      matchRate: 98,
      tags: ["핀테크", "유니콘"],
      image: "/mock/toss.jpg",
    },
    {
      id: "karrot",
      companyName: "당근 (Karrot)",
      companyDesc: "이웃과 함께하는 생활",
      matchRate: 95,
      tags: ["플랫폼", "커뮤니티"],
      image: "/mock/karrot.jpg",
    },
    {
      id: "karrot-2",
      companyName: "당근 (Karrot)",
      companyDesc: "이웃과 함께하는 생활",
      matchRate: 95,
      tags: ["플랫폼", "커뮤니티"],
      image: "/mock/karrot.jpg",
    },
    {
      id: "musinsa",
      companyName: "무신사 (Musinsa)",
      companyDesc: "패션의 모든 것",
      matchRate: 92,
      tags: ["패션", "이커머스"],
      image: "/mock/musinsa.jpg",
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
                  <div className="mp-schedule-text">카카오뱅크 1차 면접</div>
                </div>
              </div>

              <div className="mp-schedule-item">
                <div className="mp-schedule-icon is-orange" aria-hidden="true">📄</div>
                <div className="mp-schedule-body">
                  <div className="mp-schedule-time">23:59 마감</div>
                  <div className="mp-schedule-text">토스 프로덕트 디자이너 서류</div>
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
                  <div className="mp-recent-company">라인 (LINE)</div>
                  <div className="mp-recent-meta">프로덕트 디자이너 · 서류 검토 중</div>
                </div>
                <button className="mp-ghost" type="button">상세 보기</button>
              </div>

              <div className="mp-recent-item">
                <div className="mp-recent-dot is-yellow" aria-hidden="true" />
                <div className="mp-recent-body">
                  <div className="mp-recent-company">우아한형제들</div>
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
              <RecruitmentCard
                key={it.id}
                variant="preview"
                companyName={it.companyName}
                companyDesc={it.companyDesc}
                matchRate={it.matchRate}
                tags={it.tags}
                image={it.image}
              // 아래 default 전용 필드들은 preview에서는 필요 없음
              // (props 타입을 선택적(optional)로 바꿔둔 상태여야 함)
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
