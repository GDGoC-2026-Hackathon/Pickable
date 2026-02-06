/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useCallback, useState } from 'react'

import { Snackbar } from '@/components/ui/Snackbar'

import styles from './onboarding.module.css'

export function JobSeekerSection() {
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)

  const handleDemoAction = useCallback(() => {
    setSnackbarMsg(null)
    requestAnimationFrame(() =>
      setSnackbarMsg('본 화면은 예시입니다. 로그인 후 이용 바랍니다.'),
    )

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [])

  return (
    <section id="jobseekers" className={styles.sectionMuted}>
      <div className={styles.container}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <span className={styles.chipMuted}>FOR JOB SEEKERS</span>
            <h2 className={styles.sectionTitle}>맞춤형 기업 공고 큐레이션</h2>
          </div>
        </div>

        <div className={styles.jobCardRow}>
          <JobCard
            title="클라우드 펄스"
            subtitle="SaaS | 오픈소스"
            match="적합도 88%"
            price="신입 연봉 3,800~"
            onDemoAction={handleDemoAction}
          />
          <JobCard
            title="모멘트 디자인"
            subtitle="UX/UI | 브랜딩"
            match="적합도 92%"
            price="직무전환 가능"
            liked
            onDemoAction={handleDemoAction}
          />
          <JobCard
            title="하이퍼 샵"
            subtitle="이커머스 | 데이터"
            match="적합도 85%"
            price="스톡옵션 포함"
            onDemoAction={handleDemoAction}
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
              <button
                className={styles.ctaButton}
                type="button"
                onClick={handleDemoAction}
              >
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
                <div className={styles.storySub}>
                  SME에서 대기업으로 이직한 실전 루트
                </div>
              </div>
              <button
                className={styles.storyButton}
                type="button"
                onClick={handleDemoAction}
              >
                스토리 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <Snackbar message={snackbarMsg} />
    </section>
  )
}

function JobCard({
  title,
  subtitle,
  match,
  price,
  liked,
  onDemoAction,
}: {
  title: string
  subtitle: string
  match: string
  price: string
  liked?: boolean
  onDemoAction: () => void
}) {
  return (
    <article
      className={styles.jobCard}
      role="button"
      tabIndex={0}
      onClick={onDemoAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDemoAction()
      }}
    >
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
  const numbers = Array.from({ length: 35 }, (_, i) => i - 2)
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

