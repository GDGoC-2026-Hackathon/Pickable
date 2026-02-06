import Link from 'next/link'

import { auth } from '@/auth'

import { HeaderUserMenu } from './HeaderUserMenu'
import styles from './SiteHeader.module.css'

export async function SiteHeader() {
  const session = await auth()
  const user = session?.user

  const homeHref =
    user?.role === 'CORPORATION'
      ? '/dashboard-company'
      : user?.role === 'JOB_SEEKER'
        ? '/my-page-employee'
        : '/'

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href={homeHref}>
            Pickable
          </Link>
          {user ? (
            <HeaderUserMenu
              name={user.name ?? ''}
              email={user.email ?? null}
              role={user.role ?? null}
            />
          ) : null}
        </div>
      </div>
    </header>
  )
}
