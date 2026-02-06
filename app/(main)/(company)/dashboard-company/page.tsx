import Link from 'next/link'

import { CompanyInfoCard } from '@/components/company/CompanyInfoCard'

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
          <button className={styles.addButton} type="button">
            + 공고 추가하기
          </button>
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

function JobRow({
  logoSrc,
  logoAlt,
  title,
  location,
  type,
  badge,
  tone,
}: {
  logoSrc: string
  logoAlt: string
  title: string
  location: string
  type: string
  badge?: string
  tone?: 'danger'
}) {
  const badgeClass =
    tone === 'danger'
      ? styles.closed
      : badge?.startsWith('D-')
        ? styles.dDay
        : undefined

  return (
    <div className={styles.jobRow}>
        <div className={styles.jobLeft}>
        <div className={styles.jobLogoWrap}>
          <img className={styles.jobLogo} src={logoSrc} alt={logoAlt} />
        </div>
        <div className={styles.jobText}>
          <div className={styles.jobTitle}>{title}</div>
          <div className={styles.jobMeta}>
            <span className={styles.metaItem}>
              <span className={styles.pin} aria-hidden>
                <PinIcon />
              </span>
              <span>{location}</span>
            </span>
            <span className={styles.metaDivider} aria-hidden>
              ·
            </span>
            <span className={styles.metaItem}>{type}</span>
            {badge ? <span className={badgeClass}>{badge}</span> : null}
          </div>
        </div>
      </div>
      <div className={styles.jobRight}>
        <button className={styles.ghostButton} type="button">
          수정
        </button>
        <button className={styles.trashButton} type="button" aria-label="Delete">
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
