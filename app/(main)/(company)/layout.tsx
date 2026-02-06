import { CompanySidebar } from '@/components/layout/CompanySidebar'

import styles from './company-layout.module.css'

export default function CompanyAreaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <CompanySidebar />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}

