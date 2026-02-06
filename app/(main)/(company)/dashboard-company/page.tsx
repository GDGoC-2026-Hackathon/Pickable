import Link from 'next/link'

import { CompanyInfoCard } from '@/components/company/CompanyInfoCard'
import { JobPostingsList } from '@/components/company/JobPostingsList'

import styles from './dashboard-company-page.module.css'

export default function DashboardCompanyPage() {
  return (
    <>
      <section className={styles.sectionCard} aria-label="Generated branding cards">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>생성된 브랜딩 카드</div>
          <Link className={styles.linkAction} href="#">
            전체 보기
          </Link>
        </div>

        <div className={styles.brandingGrid}>
          <BrandingCard
            variant="blue"
            title="기술로 세상을 더 심플하게 만드는 사람들"
          />
          <BrandingCard
            variant="pink"
            title="우리는 불가능을 가능케 하는 파도를 탑니다"
          />
          <div className={styles.brandingCard}>
            <div className={styles.brandingCreate}>
              <div className={styles.createInner}>
                <div className={styles.createPlus} aria-hidden>
                  +
                </div>
                <div className={styles.createTitle}>새 카드 생성</div>
                <div className={styles.createSub}>AI 브랜딩 스튜디오</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionCard} aria-label="Job postings management">
        <div className={styles.listHeaderRow}>
          <div>
            <div className={styles.sectionTitle}>채용 공고 관리</div>
            <div className={styles.subText}>현재 활성화된 공고 3개</div>
          </div>
          <a className={styles.addButton} href="/add-recruitment-company">
            + 공고 추가하기
          </a>
        </div>

        <div className={styles.jobList}>
          <JobRow
            logoSrc="/images/logo1.png"
            logoAlt="logo1"
            title="시니어 백엔드 엔지니어 (Java/Spring)"
            location="서울 강남구"
            type="정규직"
            badge="D-14"
          />
          <JobRow
            logoSrc="/images/logo2.png"
            logoAlt="logo2"
            title="프로덕트 디자이너 (UI/UX)"
            location="서울 강남구"
            type="정규직"
          />
          <JobRow
            logoSrc="/images/logo3.png"
            logoAlt="logo3"
            title="데이터 분석가 (Data Analyst)"
            location="서울 강남구"
            type="인턴"
            badge="오늘마감"
            tone="danger"
          />
        </div>
      </section>

      <CompanyInfoCard />
    </>
  )
}

function BrandingCard({
  variant,
  title,
}: {
  variant: 'blue' | 'pink'
  title: string
}) {
  const imageClass =
    variant === 'blue' ? styles.brandingImageBlue : styles.brandingImagePink
  return (
    <div className={styles.brandingCard}>
      <div className={imageClass} aria-hidden>
        <div className={styles.brandingOverlay}>
          <span className={styles.brandPill}>사용중</span>
          <div className={styles.brandingTitle}>{title}</div>
          <div className={styles.brandingActions}>
            <button className={styles.applyButton} type="button">
              적용하기
            </button>
            <button className={styles.moreButton} type="button" aria-label="More">
              …
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

