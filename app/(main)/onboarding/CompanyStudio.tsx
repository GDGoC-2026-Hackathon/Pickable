/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useCallback, useMemo, useState } from 'react'

import RecruitmentCard from '@/components/layout/RecruitmentCard'
import { Snackbar } from '@/components/ui/Snackbar'

import styles from './onboarding.module.css'

export function CompanyStudio() {
  const [companyName, setCompanyName] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)

  const displayCompanyName = useMemo(() => {
    return companyName.trim() || 'Sample'
  }, [companyName])

  const handleCreateBrandingCard = useCallback(() => {
    // re-trigger even if same message
    setSnackbarMsg(null)
    requestAnimationFrame(() => setSnackbarMsg('로그인 후 이용 바랍니다'))

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [])

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
            <form
              className={styles.form}
              aria-label="AI 브랜딩 스튜디오 폼"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="companyName">
                  회사 이름
                </label>
                <input
                  id="companyName"
                  className={styles.input}
                  placeholder="회사명을 입력해보세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.currentTarget.value)}
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

              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleCreateBrandingCard}
              >
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
            <div className={styles.flip}>
              <div className={styles.flipInner}>
                <div className={styles.flipFace}>
                  <div className={styles.previewScaled}>
                    <RecruitmentCard
                      variant="preview"
                      companyName={displayCompanyName}
                      companyDesc="AI 브랜딩 스튜디오"
                      matchRate={98}
                      tags={['#기술중심', '#팀문화', '#성장환경']}
                      image={gradient('0b63ff', '0b1220')}
                    />
                  </div>
                </div>
                <div className={`${styles.flipFace} ${styles.flipBack}`}>
                  <RecruitmentCard
                    companyName={displayCompanyName}
                    companyDesc="SaaS 전문 강소기업"
                    matchRate={98}
                    hiringLabel="채용 중"
                    tags={['핀테크', '유니콘', '시리즈D']}
                    positionTitle="Front-end Engineer"
                    deadline="2025.03.20"
                    experience="경력 3년 이상"
                    location="광화문"
                    salary="4,000만원 이상"
                    workTime="09:00 ~ 18:00"
                    liked={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar message={snackbarMsg} />
    </section>
  )
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
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
