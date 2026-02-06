'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

import styles from './SiteHeader.module.css'

function getDashboardUrl(role?: string | null): string {
  if (role === 'CORPORATION') return '/dashboard-company'
  if (role === 'JOB_SEEKER') return '/my-page-employee'
  return '/'
}

type HeaderUserMenuProps = {
  name: string
  email: string | null
  role?: string | null
}

export function HeaderUserMenu({ name, email, role }: HeaderUserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  const displayName = name || email || '사용자'

  return (
    <div className={styles.userMenuWrap} ref={menuRef}>
      <div className={styles.headerRight}>
        <Link
          className={styles.userName}
          href={getDashboardUrl(role)}
        >
          {displayName}
        </Link>
        <button
          type="button"
          className={styles.settingsBtn}
          onClick={(e) => {
            e.preventDefault()
            setOpen((v) => !v)
          }}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="환경설정 메뉴"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {open && (
        <div className={styles.dropdown} role="menu">
          {role === 'JOB_SEEKER' && (
            <Link
              className={styles.dropdownItem}
              href="/edit-profile-employee"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              프로필 수정
            </Link>
          )}
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => signOut({ callbackUrl: '/' })}
            role="menuitem"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
