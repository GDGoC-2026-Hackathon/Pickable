'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './CompanySidebar.module.css'

const NAV_ITEMS = [
  { href: '/dashboard-company', label: '대시보드' },
  { href: '/guide-company', label: '채용 공고 가이드' },
  { href: '/edit-profile-company', label: '기업 정보 수정' },
] as const

export function CompanySidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar} aria-label="Company dashboard sidebar">
      <div className={styles.profileCard}>
        <div className={styles.avatar} aria-hidden />
        <div className={styles.companyName}>테크웨이브 (TechWave)</div>
        <div className={styles.companyMeta}>IT · 소프트웨어 개발</div>
        <nav className={styles.nav} aria-label="Company dashboard">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard-company' &&
                pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? styles.navItemActive : styles.navItem}
              >
                <span className={styles.navIcon} aria-hidden>
                  ▦
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className={styles.premiumCard} aria-label="Premium plan">
        <div className={styles.premiumKicker}>PREMIUM PLAN</div>
        <div className={styles.premiumTitle}>
          AI 브랜딩 카드로
          <br />
          더욱 효과적으로 홍보하세요!
        </div>
        <button className={styles.premiumButton} type="button">
          플랜 업그레이드
        </button>
      </div>
    </aside>
  )
}
