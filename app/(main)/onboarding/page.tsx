import type { ReactNode } from 'react'

import { signIn } from '@/auth'
import { CompanyStudio } from './CompanyStudio'
import { JobSeekerSection } from './JobSeekerSection'


import styles from './onboarding.module.css'

export default function OnboardingPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <CompanyStudio />
        <JobSeekerSection />
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroTop}>
          <p className={styles.heroKicker}>성장의 기회를 연결하는</p>
          <h1 className={styles.heroTitle}>
            SME Branding &amp; Smart Matching
          </h1>
          <p className={styles.heroSub}>
            당신의 역할에 맞춰 Pickable의 모든 기능을 시작해보세요.
          </p>
        </div>

        <div className={styles.roleGrid}>
          <RoleCard
            title="기업 담당자라면"
            description="AI 브랜딩으로 회사의 가치를 높이고, 최적의 인재를 만나보세요."
            buttonLabel="Google 계정으로 기업 로그인"
            icon={<BriefcaseIcon />}
            role="CORPORATION"
          />
          <RoleCard
            title="취업 준비생이라면"
            description="나에게 맞는 중소기업을 추천받고, 커리어 로드맵을 설계해보세요."
            buttonLabel="Google 계정으로 취준생 로그인"
            icon={<SparkleIcon />}
            role="JOB_SEEKER"
          />
        </div>
      </div>
    </section>
  )
}

function RoleCard({
  title,
  description,
  buttonLabel,
  icon,
  role,
}: {
  title: string
  description: string
  buttonLabel: string
  icon: ReactNode
  role: 'CORPORATION' | 'JOB_SEEKER'
}) {
  const callbackUrl = `/onboarding/complete?role=${role}`

  return (
    <section className={styles.roleCard} aria-label={title}>
      <div className={styles.roleIcon}>{icon}</div>
      <h2 className={styles.roleTitle}>{title}</h2>
      <p className={styles.roleDesc}>{description}</p>
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: callbackUrl })
        }}
      >
        <button className={styles.googleButton} type="submit">
          <GoogleIcon />
          <span>{buttonLabel}</span>
        </button>
      </form>
    </section>
  )
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.googleIcon}
    >
      <path
        d="M21.6 12.2727C21.6 11.4218 21.5236 10.6036 21.3818 9.81818H12V13.58H17.36C17.1291 14.8164 16.4327 15.8645 15.3873 16.5527V18.9927H18.6073C20.4873 17.2655 21.6 14.72 21.6 12.2727Z"
        fill="#4285F4"
      />
      <path
        d="M12 22C14.69 22 16.9455 21.1055 18.6073 18.9927L15.3873 16.5527C14.4927 17.1527 13.3527 17.5073 12 17.5073C9.40545 17.5073 7.20909 15.7545 6.42182 13.3982H3.09637V15.9164C4.74727 19.2 8.14364 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42182 13.3982C6.22182 12.7982 6.10727 12.1564 6.10727 11.4964C6.10727 10.8364 6.22182 10.1945 6.42182 9.59455V7.07637H3.09637C2.41637 8.43091 2.02728 9.96364 2.02728 11.4964C2.02728 13.0291 2.41637 14.5618 3.09637 15.9164L6.42182 13.3982Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.48545C13.4764 5.48545 14.8018 5.99273 15.8436 6.98909L18.68 4.15273C16.94 2.52 14.6845 1.5 12 1.5C8.14364 1.5 4.74727 4.3 3.09637 7.07636L6.42182 9.59455C7.20909 7.23818 9.40545 5.48545 12 5.48545Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 7V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 9C5 7.89543 5.89543 7 7 7H17C18.1046 7 19 7.89543 19 9V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.4 8.6L20 10L13.4 11.4L12 18L10.6 11.4L4 10L10.6 8.6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 14L19.6 16.6L22 17.2L19.6 17.8L19 20.4L18.4 17.8L16 17.2L18.4 16.6L19 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
