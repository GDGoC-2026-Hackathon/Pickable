'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import type { CorporationProfile } from '@/types/next-auth'

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

const DEFAULT_AVATAR = '/icons/techwave-o.avif'

export function CompanySidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [fallbackProfile, setFallbackProfile] =
    useState<CorporationProfile | null>(null)

  // 세션에 기업 정보가 없으면 API로 한 번 더 조회 (예: 예전에 로그인한 JWT)
  useEffect(() => {
    if (status !== 'authenticated' || session?.corporation) return
    let cancelled = false
    fetch('/api/corporation/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.data) return
        setFallbackProfile(json.data)
      })
    return () => {
      cancelled = true
    }
  }, [status, session?.corporation])

  const profile = session?.corporation ?? fallbackProfile
  const loading = status === 'loading'
  const avatarSrc = profile?.thumbnailUrl || DEFAULT_AVATAR
  const companyName = profile?.name ?? '—'
  const companyMeta = profile?.industry ?? '—'

  return (
    <aside className={styles.sidebar} aria-label="Company dashboard sidebar">
      <div className={styles.profileCard}>
        {loading ? (
          <div className={styles.avatarSkeleton} aria-hidden />
        ) : (
          <img
            className={styles.avatar}
            src={avatarSrc}
            alt=""
            aria-hidden
          />
        )}
        <div className={styles.companyName}>
          {loading ? '…' : companyName}
        </div>
        <div className={styles.companyMeta}>
          {loading ? '…' : companyMeta}
        </div>
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
