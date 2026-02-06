import Link from 'next/link'

import { auth } from '@/auth'

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
            <div className={styles.headerRight}>
              <span className={styles.userName}>
                {user.name || user.email || '사용자'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

