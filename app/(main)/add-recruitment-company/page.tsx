import { JobPostingForm } from '@/components/company/JobPostingForm'

import styles from './add-recruitment-company.module.css'

export default function AddRecruitmentCompanyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.kicker}>JOB POSTING</div>
          <h1 className={styles.title}>새로운 채용 공고 등록</h1>
          <p className={styles.subTitle}>
            최적의 인재를 찾기 위한 상세한 공고 내용을 입력해주세요.
          </p>
        </header>

        <div className={styles.grid}>
          <section className={styles.card} aria-label="채용 공고 등록 폼">
            <div className={styles.cardHeader}>
              <span className={styles.cardIconWrap} aria-hidden>
                <img
                  className={styles.cardIcon}
                  src="/icons/recruitment-detail.png"
                  alt=""
                />
              </span>
              <div className={styles.cardHeaderText}>공고 상세 정보</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <JobPostingForm mode="create" />
            </div>
          </section>

          <aside className={styles.rightCol} aria-label="가이드">
            <section className={styles.guideCard} aria-label="공고 등록 가이드">
              <div className={styles.guideTitle}>공고 등록 가이드</div>
              <ul className={styles.guideList}>
                <li>직무 키워드는 상세히 적을수록 AI 매칭 정확도가 올라갑니다.</li>
                <li>출퇴근 시간 데이터는 라이프스타일 매칭 점수에 반영됩니다.</li>
                <li>마감일은 공고 게시 후에도 수정이 가능합니다.</li>
                <li>
                  <span className={styles.required}>*</span> 표시는 필수
                  항목입니다.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
