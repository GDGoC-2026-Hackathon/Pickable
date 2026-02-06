import Link from 'next/link'

import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const isLoggedIn = true

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/">
            Pickable
          </Link>
          <div className={styles.headerRight}>
            {isLoggedIn ? (
                <Link
                href="/my-page-employee"
                className={styles.loginButton}
              >
                홍길동 님
              </Link>
            ) : (
              <>
              <span className={styles.headerHint}>이미 계정이 있으신가요?</span>
              <button className={styles.loginButton} type="button">
                로그인
              </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

