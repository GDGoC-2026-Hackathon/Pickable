'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './CompanySidebar.module.css'

const NAV_ITEMS = [
  {
    href: '/dashboard-company',
    label: '대시보드',
    iconBase: 'dashboard',
  },
  {
    href: '/guide-company',
    label: '채용 공고 가이드',
    iconBase: 'lightbulb',
  },
  {
    href: '/edit-profile-company',
    label: '기업 정보 수정',
    iconBase: 'settings',
  },
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
            const iconSrc = `/icons/${item.iconBase}-${isActive ? 'activated' : 'disabled'}.png`
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? styles.navItemActive : styles.navItem}
              >
                <img
                  className={styles.navIcon}
                  src={iconSrc}
                  alt=""
                  aria-hidden
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
