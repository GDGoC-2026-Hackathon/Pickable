import Link from 'next/link'

import { auth } from '@/auth'

import { HeaderUserMenu } from './HeaderUserMenu'
import styles from './SiteHeader.module.css'

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

