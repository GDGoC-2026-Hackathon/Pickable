import Link from 'next/link'

import { CompanyInfoCard } from '@/components/company/CompanyInfoCard'
import { JobPostingsList } from '@/components/company/JobPostingsList'
import RecruitmentCard from '@/components/layout/RecruitmentCard'

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
          <FlippableRecruitmentCard
            front={{
              variant: 'preview',
              companyName: '테크웨이브',
              companyDesc: 'AI 브랜딩 스튜디오',
              matchRate: 98,
              tags: ['기술중심', '팀문화', '성장환경'],
              image: gradient('0b63ff', '0b1220'),
            }}
            back={{
              companyName: '테크웨이브',
              companyDesc: 'AI 브랜딩 스튜디오',
              matchRate: 98,
              hiringLabel: '사용 중',
              tags: ['기술중심', '팀문화', '성장환경'],
              positionTitle: '브랜딩 카드 상세',
              deadline: '2025.12.31',
              experience: '브랜딩/채용',
              location: '서울 강남구',
              salary: '—',
              workTime: '—',
              liked: false,
            }}
          />
          <FlippableRecruitmentCard
            front={{
              variant: 'preview',
              companyName: '테크웨이브',
              companyDesc: 'AI 브랜딩 스튜디오',
              matchRate: 92,
              tags: ['유연근무', '리모트', '스톡옵션'],
              image: gradient('7c3aed', '111827'),
            }}
            back={{
              companyName: '테크웨이브',
              companyDesc: 'AI 브랜딩 스튜디오',
              matchRate: 92,
              hiringLabel: '사용 중',
              tags: ['유연근무', '리모트', '스톡옵션'],
              positionTitle: '브랜딩 카드 상세',
              deadline: '2025.12.31',
              experience: '브랜딩/채용',
              location: '서울 강남구',
              salary: '—',
              workTime: '—',
              liked: false,
            }}
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

      <JobPostingsList />

      <CompanyInfoCard />
    </>
  )
}

function gradient(colorA: string, colorB: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <radialGradient id="g1" cx="20%" cy="20%" r="90%">
        <stop offset="0%" stop-color="#${colorA}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="#${colorA}" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#${colorB}" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${colorB}"/>
        <stop offset="100%" stop-color="#${colorB}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g2)"/>
    <rect width="1200" height="800" fill="url(#g1)"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function FlippableRecruitmentCard({
  front,
  back,
}: {
  front: Parameters<typeof RecruitmentCard>[0]
  back: Parameters<typeof RecruitmentCard>[0]
}) {
  return (
    <div className={styles.flip}>
      <div className={styles.flipInner}>
        <div className={styles.flipFace}>
          <RecruitmentCard {...front} />
        </div>
        <div className={`${styles.flipFace} ${styles.flipBack}`}>
          <RecruitmentCard {...back} />
        </div>
      </div>
    </div>
  )
}
