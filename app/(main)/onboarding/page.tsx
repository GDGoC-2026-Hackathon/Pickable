import type { ReactNode } from 'react'
import Link from 'next/link'

import styles from './onboarding.module.css'

export default function OnboardingPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <CompanyStudio />
        <JobSeekerSection />
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroTop}>
          <p className={styles.heroKicker}>성장의 기회를 연결하는</p>
          <h1 className={styles.heroTitle}>
            중소기업 AI 브랜딩 &amp; 추천 플랫폼
          </h1>
          <p className={styles.heroSub}>
            당신의 역할에 맞춰 Pickable의 모든 기능을 시작해보세요.
          </p>
        </div>

        <div className={styles.roleGrid}>
          <RoleCard
            title="기업 담당자라면"
            description="AI 브랜딩으로 회사의 가치를 높이고, 최적의 인재를 만나보세요."
            buttonLabel="Google 계정으로 기업 로그인"
            icon={<BriefcaseIcon />}
            intent="CORPORATION"
          />
          <RoleCard
            title="취업 준비생이라면"
            description="나에게 맞는 중소기업을 추천받고, 커리어 로드맵을 설계해보세요."
            buttonLabel="Google 계정으로 취준생 로그인"
            icon={<SparkleIcon />}
            intent="JOB_SEEKER"
          />
        </div>
      </div>
    </section>
  )
}

function RoleCard({
  title,
  description,
  buttonLabel,
  icon,
  intent,
}: {
  title: string
  description: string
  buttonLabel: string
  icon: ReactNode
  intent: 'JOB_SEEKER' | 'CORPORATION'
}) {
  const href = {
    pathname: '/login',
    query: { callbackUrl: `/after-login?intent=${intent}` },
  } as const
  return (
    <section className={styles.roleCard} aria-label={title}>
      <div className={styles.roleIcon}>{icon}</div>
      <h2 className={styles.roleTitle}>{title}</h2>
      <p className={styles.roleDesc}>{description}</p>
      <Link className={styles.googleButton} href={href}>
        <GoogleIcon />
        <span>{buttonLabel}</span>
      </Link>
    </section>
  )
}

function CompanyStudio() {
  return (
    <section id="companies" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.chip}>FOR COMPANIES</span>
          <div className={styles.sectionHeaderRow}>
            <h2 className={styles.sectionTitle}>AI 브랜딩 스튜디오</h2>
            <span className={styles.sectionMeta}>
              <span className={styles.dot} aria-hidden />
              실시간 자동 생성 가능
            </span>
          </div>
        </div>

        <div className={styles.companyGrid}>
          <div className={styles.card}>
            <form className={styles.form} aria-label="AI 브랜딩 스튜디오 폼">
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="companyName">
                  회사 이름
                </label>
                <input
                  id="companyName"
                  className={styles.input}
                  placeholder="예: 내시리 네트웍스"
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="companyUrl">
                  공식 웹사이트 URL
                </label>
                <input
                  id="companyUrl"
                  className={styles.input}
                  placeholder="https://..."
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="descLong">
                  회사 한문장 소개
                </label>
                <textarea
                  id="descLong"
                  className={styles.textarea}
                  placeholder="회사의 핵심 가치를 한문장으로 간단히 적어주세요 (AI가 이를 바탕으로 작성합니다)"
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="descShort">
                  회사 한줄 소개
                </label>
                <textarea
                  id="descShort"
                  className={styles.textarea}
                  placeholder="회사의 핵심 키워드나 문장을 간단히 적어주세요 (AI가 이를 바탕으로 작성합니다)"
                />
              </div>

              <button className={styles.primaryButton} type="button">
                AI 브랜딩 카드 무료 제작하기
              </button>

              <div className={styles.noticeCard} role="note">
                <div className={styles.noticeBadge} aria-hidden>
                  P
                </div>
                <div className={styles.noticeText}>
                  <div className={styles.noticeTitle}>프리미엄 디자인 브랜딩</div>
                  <div className={styles.noticeSub}>
                    입력한 정보로 AI가 기업 브랜딩 카드를 제작합니다
                  </div>
                </div>
                <button className={styles.noticeCta} type="button">
                  상담 신청
                </button>
              </div>
            </form>
          </div>

          <div className={styles.previewCard} aria-label="브랜딩 카드 미리보기">
            <div className={styles.previewImage} aria-hidden />
            <div className={styles.previewOverlay}>
              <span className={styles.previewPill}>AI GENERATED</span>
              <div className={styles.previewTitle}>넥스트 웨이브</div>
              <div className={styles.previewSubtitle}>디지털 랩</div>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewCaption}>#기술중심 #팀문화 #성장환경</div>
              <p className={styles.previewText}>
                사람과 기술이 함께 성장하는 팀. AI로 세상을 연결하는 즐거움을
                만듭니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JobSeekerSection() {
  return (
    <section id="jobseekers" className={styles.sectionMuted}>
      <div className={styles.container}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.chipMuted}>FOR JOB SEEKERS</span>
            <h2 className={styles.sectionTitle}>맞춤형 기업 공고 큐레이션</h2>
          </div>
          <button className={styles.secondaryButton} type="button">
            내 프로필 생성하기
          </button>
        </div>

        <div className={styles.jobCardRow}>
          <JobCard
            title="클라우드 펄스"
            subtitle="SaaS | 오픈소스"
            match="적합도 88%"
            price="신입 연봉 3,800~"
          />
          <JobCard
            title="모멘트 디자인"
            subtitle="UX/UI | 브랜딩"
            match="적합도 92%"
            price="직무전환 가능"
            liked
          />
          <JobCard
            title="하이퍼 샵"
            subtitle="이커머스 | 데이터"
            match="적합도 85%"
            price="스톡옵션 포함"
          />
        </div>

        <div className={styles.widgetGrid}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>2025.01 채용 캘린더</div>
              <div className={styles.widgetNav} aria-hidden>
                <span className={styles.widgetNavBtn}>‹</span>
                <span className={styles.widgetNavBtn}>›</span>
              </div>
            </div>
            <CalendarMock />
          </div>

          <div className={styles.widgetStack}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetTitleRow}>
                <span className={styles.widgetTitle}>실시간 공고 링크</span>
                <span className={styles.pulse} aria-hidden />
              </div>
              <ul className={styles.linkList}>
                <li className={styles.linkItem}>클라우드 펄스 채용</li>
                <li className={styles.linkItem}>모멘트 디자인 채용</li>
              </ul>
            </div>

            <div className={styles.ctaCard}>
              <div className={styles.ctaTitle}>
                이 기업을 저격한<br />
                선배들의 커리어는?
              </div>
              <div className={styles.ctaSub}>
                “비슷한 경험을 가진 선배들의 커리어를 추천해요”
              </div>
              <button className={styles.ctaButton} type="button">
                인사이트 리포트 보기
              </button>
            </div>
          </div>
        </div>

        <div className={styles.lowerGrid}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetTitle}>커리어 추천: 테크웨이브</div>
            <div className={styles.timeline}>
              <div className={styles.timelineStep}>
                <span className={styles.timelineDot} aria-hidden />
                <div>
                  <div className={styles.timelineLabel}>SME</div>
                  <div className={styles.timelineSub}>테크웨이브 솔루션(현재)</div>
                </div>
              </div>
              <div className={styles.timelineStep}>
                <span className={styles.timelineDotMuted} aria-hidden />
                <div>
                  <div className={styles.timelineLabel}>다음</div>
                  <div className={styles.timelineSub}>네이버 / 카카오 / 당근</div>
                </div>
              </div>
              <div className={styles.timelineStep}>
                <span className={styles.timelineDotMuted} aria-hidden />
                <div>
                  <div className={styles.timelineLabel}>목표</div>
                  <div className={styles.timelineSub}>시니어 엔지니어 / 리드</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.widgetStack}>
            <div className={styles.widgetCard}>
              <div className={styles.widgetTitle}>불합격 시 재도전 가이드</div>
              <p className={styles.mutedText}>
                이력서, 포트폴리오, 면접 피드백을 기반으로 다음 액션을
                추천합니다.
              </p>
              <div className={styles.checkItem}>기술 면접 빈틈 키워드 분석</div>
              <div className={styles.checkItem}>포트폴리오 개선 포인트 진단</div>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyBody}>
                <div className={styles.storyName}>박민서 님의 커리어 로드맵</div>
                <div className={styles.storySub}>SME에서 대기업으로 이직한 실전 루트</div>
              </div>
              <button className={styles.storyButton} type="button">
                스토리 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JobCard({
  title,
  subtitle,
  match,
  price,
  liked,
}: {
  title: string
  subtitle: string
  match: string
  price: string
  liked?: boolean
}) {
  return (
    <article className={styles.jobCard}>
      <div className={styles.jobTop}>
        <div className={styles.jobLogo} aria-hidden>
          {title.slice(0, 1)}
        </div>
        <div
          className={liked ? styles.heartActive : styles.heart}
          aria-label={liked ? 'liked' : 'not liked'}
        >
          ♥
        </div>
      </div>
      <div className={styles.jobTitle}>{title}</div>
      <div className={styles.jobSub}>{subtitle}</div>
      <div className={styles.badgeRow}>
        <span className={styles.badgeBlue}>{match}</span>
        <span className={styles.badgeGreen}>채용 중</span>
      </div>
      <div className={styles.jobBottom}>
        <div className={styles.jobMeta}>{price}</div>
        <span className={styles.jobLink}>상세보기 →</span>
      </div>
    </article>
  )
}

function CalendarMock() {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const numbers = Array.from({ length: 35 }, (_, i) => i - 2) // starts a bit earlier
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHead}>
        {days.map((d) => (
          <div key={d} className={styles.calendarDow}>
            {d}
          </div>
        ))}
      </div>
      <div className={styles.calendarGrid}>
        {numbers.map((n, idx) => {
          const day = n + 1
          const isActive = day === 4
          const isValid = day >= 1 && day <= 31
          return (
            <div
              key={idx}
              className={
                isActive
                  ? styles.dayActive
                  : isValid
                    ? styles.day
                    : styles.dayMuted
              }
            >
              {isValid ? day : ''}
            </div>
          )
        })}
      </div>
      <div className={styles.calendarLegend}>
        <span className={styles.legendDot} aria-hidden />
        마감임박 공고
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.googleIcon}
    >
      <path
        d="M21.6 12.2727C21.6 11.4218 21.5236 10.6036 21.3818 9.81818H12V13.58H17.36C17.1291 14.8164 16.4327 15.8645 15.3873 16.5527V18.9927H18.6073C20.4873 17.2655 21.6 14.72 21.6 12.2727Z"
        fill="#4285F4"
      />
      <path
        d="M12 22C14.69 22 16.9455 21.1055 18.6073 18.9927L15.3873 16.5527C14.4927 17.1527 13.3527 17.5073 12 17.5073C9.40545 17.5073 7.20909 15.7545 6.42182 13.3982H3.09637V15.9164C4.74727 19.2 8.14364 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42182 13.3982C6.22182 12.7982 6.10727 12.1564 6.10727 11.4964C6.10727 10.8364 6.22182 10.1945 6.42182 9.59455V7.07637H3.09637C2.41637 8.43091 2.02728 9.96364 2.02728 11.4964C2.02728 13.0291 2.41637 14.5618 3.09637 15.9164L6.42182 13.3982Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.48545C13.4764 5.48545 14.8018 5.99273 15.8436 6.98909L18.68 4.15273C16.94 2.52 14.6845 1.5 12 1.5C8.14364 1.5 4.74727 4.3 3.09637 7.07636L6.42182 9.59455C7.20909 7.23818 9.40545 5.48545 12 5.48545Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 7V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.4 8.6L20 10L13.4 11.4L12 18L10.6 11.4L4 10L10.6 8.6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 14L19.6 16.6L22 17.2L19.6 17.8L19 20.4L18.4 17.8L16 17.2L18.4 16.6L19 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
