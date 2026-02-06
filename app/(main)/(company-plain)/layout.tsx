import { CompanyAuthGuard } from '@/components/company/CompanyAuthGuard'

import styles from './company-plain-layout.module.css'

export default function CompanyPlainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CompanyAuthGuard>
      <div className={styles.page}>
        <div className={styles.container}>{children}</div>
      </div>
    </CompanyAuthGuard>
  )
}

