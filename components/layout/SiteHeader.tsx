import Link from 'next/link'

import { auth } from '@/auth'

import styles from './SiteHeader.module.css'

function getDashboardUrl(role?: string | null): string {
  if (role === 'CORPORATION') return '/dashboard-company'
  // JOB_SEEKER → 취준생 마이페이지
  if (role === 'JOB_SEEKER') return '/my-page-employee'
  return '/'
}

export async function SiteHeader() {
  const session = await auth()
  const user = session?.user

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/">
            Pickable
          </Link>
          {user ? (
            <div className={styles.headerRight}>
              <Link
                className={styles.userName}
                href={getDashboardUrl(user.role)}
              >
                {user.name || user.email || '사용자'}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

