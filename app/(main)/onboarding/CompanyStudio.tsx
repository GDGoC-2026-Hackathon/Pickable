/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useCallback, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import FlippableRecruitmentCard from '@/components/layout/FlippableRecruitmentCard'
import { Snackbar } from '@/components/ui/Snackbar'

import styles from './onboarding.module.css'

export function CompanyStudio() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [companyUrl, setCompanyUrl] = useState('')
  const [companyDesc, setCompanyDesc] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const isCorporation =
    status === 'authenticated' && session?.user?.role === 'CORPORATION'

  const displayCompanyName = useMemo(() => {
    return companyName.trim() || 'Sample'
  }, [companyName])

  const handleCreateBrandingCard = useCallback(async () => {
    if (!isCorporation) {
      // 로그인 안 되어 있으면 로그인 유도
      const prefersReducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
      setSnackbarMsg(null)
      requestAnimationFrame(() =>
        setSnackbarMsg('기업 계정으로 로그인 후 이용 바랍니다'),
      )
      return
    }

    // 기업 로그인 상태 → 폼 입력값과 함께 generate API 호출
    setGenerating(true)
    try {
      const body: { prompt?: string; companyName?: string; companyUrl?: string; companyDesc?: string } = {}
      if (companyName.trim()) body.companyName = companyName.trim()
      if (companyUrl.trim()) body.companyUrl = companyUrl.trim()
      if (companyDesc.trim()) body.companyDesc = companyDesc.trim()

      const res = await fetch('/api/corporation/branding-card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        const msg = json?.error?.message ?? 'AI 브랜딩 카드 생성에 실패했습니다.'
        setSnackbarMsg(null)
        requestAnimationFrame(() => setSnackbarMsg(msg))
        return
      }
      // 생성 성공 → 결과 페이지로 이동
      router.push('/branding-card-result-company')
    } catch {
      setSnackbarMsg(null)
      requestAnimationFrame(() =>
        setSnackbarMsg('네트워크 오류가 발생했습니다. 다시 시도해주세요.'),
      )
    } finally {
      setGenerating(false)
    }
  }, [isCorporation, router, companyName, companyUrl, companyDesc])

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
          <div className={styles.card} style={{ position: 'relative' }}>
            {/* 로그인 안 된 상태: 오버레이 */}
            {!isCorporation && (
              <div className={styles.formOverlay}>
                <div className={styles.formOverlayInner}>
                  <div className={styles.formOverlayIcon} aria-hidden>
                    🔒
                  </div>
                  <div className={styles.formOverlayTitle}>
                    기업 계정으로 로그인하고 사용하세요
                  </div>
                  <div className={styles.formOverlaySub}>
                    AI 브랜딩 카드를 제작하려면 기업 담당자 계정이 필요합니다.
                    <br />
                    위의 &quot;Google 계정으로 기업 로그인&quot; 버튼을 눌러주세요.
                  </div>
                </div>
              </div>
            )}
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
                  disabled={!isCorporation}
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
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.currentTarget.value)}
                  disabled={!isCorporation}
                />
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="companyDesc">
                  회사 한줄 소개
                </label>
                <textarea
                  id="companyDesc"
                  className={styles.textarea}
                  placeholder="회사의 핵심 가치나 한줄 소개를 적어주세요 (AI 브랜딩 카드 생성 시 참고됩니다)"
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.currentTarget.value)}
                  disabled={!isCorporation}
                />
              </div>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleCreateBrandingCard}
                disabled={generating}
              >
                {generating ? 'AI가 카드를 생성 중입니다...' : 'AI 브랜딩 카드 무료 제작하기'}
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
            <div className={styles.previewScaled}>
              <FlippableRecruitmentCard
                flipOnHover
                front={{
                  variant: 'preview',
                  companyName: displayCompanyName,
                  companyDesc: 'AI 브랜딩 스튜디오',
                  matchRate: 98,
                  tags: ['#기술중심', '#팀문화', '#성장환경'],
                  image: gradient('0b63ff', '0b1220'),
                }}
                back={{
                  companyName: displayCompanyName,
                  companyDesc: 'Front-end Engineer',
                  matchRate: 98,
                  hiringLabel: '채용 중',
                  tags: [],
                  positionTitle: 'Front-end Engineer',
                  deadline: '2025.03.20',
                  experience: '경력 3년 이상',
                  location: '광화문',
                  salary: '4,000만원 이상',
                  workTime: '09:00 ~ 18:00',
                  liked: false,
                }}
              />
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
