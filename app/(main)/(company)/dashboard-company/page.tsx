'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { JobPostingsList } from '@/components/company/JobPostingsList'
import FlippableRecruitmentCard from '@/components/layout/FlippableRecruitmentCard'

import styles from './dashboard-company-page.module.css'

const BG_COLORS: Record<string, [string, string]> = {
  navy: ['0b63ff', '0b1220'],
  green: ['1fbf7a', '0b1220'],
  purple: ['7c3aed', '111827'],
  black: ['333333', '0b1220'],
}

interface BrandingCardItem {
  id: string
  catchphrase: string
  description: string
  keywords: string[]
  backgroundStyle: string
  backgroundUrl?: string | null
  status: string
}

export default function DashboardCompanyPage() {
  const { data: session } = useSession()
  const [card, setCard] = useState<BrandingCardItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch('/api/corporation/branding-card', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.data) return
        setCard(json.data as BrandingCardItem)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const companyName = session?.corporation?.name ?? '기업'

  const tagList = useMemo(() => {
    if (!card?.keywords?.length) return ['#기술중심', '#팀문화', '#성장환경']
    return card.keywords.map((k) => (k.startsWith('#') ? k : `#${k}`))
  }, [card?.keywords])

  const cardImage = useMemo(() => {
    if (!card) return gradient(...BG_COLORS.navy)
    const url = card.backgroundUrl ?? null
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) return url
    return gradient(...(BG_COLORS[card.backgroundStyle] ?? BG_COLORS.navy))
  }, [card])

  return (
    <>
      <section
        className={styles.sectionCard}
        aria-label="Generated branding cards"
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>생성된 브랜딩 카드</div>
          <Link className={styles.linkAction} href="/branding-card-result-company">
            전체 보기
          </Link>
        </div>

        <div className={styles.brandingGrid}>
          {loading ? (
            <div className={styles.brandingCard}>
              <div className={styles.brandingCreate}>
                <div className={styles.createInner}>
                  <div className={styles.loadingSpinner} />
                  <div className={styles.loadingText}>불러오는 중...</div>
                </div>
              </div>
            </div>
          ) : card ? (
            <Link
              href="/branding-card-result-company"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <FlippableRecruitmentCard
                flipOnHover
                className={styles.brandingFlip}
                front={{
                  variant: 'preview',
                  companyName,
                  companyDesc: card.catchphrase,
                  matchRate: 98,
                  tags: tagList,
                  image: cardImage,
                }}
                back={{
                  companyName,
                  companyDesc: card.catchphrase,
                  matchRate: 98,
                  hiringLabel: card.status === 'PUBLISHED' ? '공개 중' : '초안',
                  tags: tagList.map((t) => t.replace(/^#/, '')),
                  positionTitle: '브랜딩 카드',
                  deadline: '—',
                  experience: '편집하기',
                  location: '—',
                  salary: '—',
                  workTime: '—',
                  liked: false,
                }}
              />
            </Link>
          ) : null}

          <Link
            href={card ? '/branding-card-result-company' : '/onboarding#companies'}
            className={styles.brandingCard}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className={styles.brandingCreate}>
              <div className={styles.createInner}>
                <div className={styles.createPlus} aria-hidden>
                  +
                </div>
                <div className={styles.createTitle}>
                  {card ? '카드 수정 / 재생성' : '새 카드 생성'}
                </div>
                <div className={styles.createSub}>AI 브랜딩 스튜디오</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <JobPostingsList />
    </>
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

