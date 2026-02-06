import styles from './CompanyInfoCard.module.css'

export function CompanyInfoCard() {
  return (
    <section className={styles.card} aria-label="Company information edit">
      <div className={styles.title}>기업 정보 수정</div>

      <form>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="companyName">
              기업명
            </label>
            <input
              id="companyName"
              className={styles.input}
              placeholder="예: 테크웨이브 (TechWave)"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="industry">
              산업군
            </label>
            <input
              id="industry"
              className={styles.input}
              placeholder="예: IT · 소프트웨어 개발"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="size">
              기업 규모
            </label>
            <input
              id="size"
              className={styles.input}
              placeholder="예: 50인 ~ 100인"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="homepage">
              홈페이지 URL
            </label>
            <input
              id="homepage"
              className={styles.input}
              placeholder="예: https://techwave.io"
            />
          </div>

          <div className={styles.addressRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="address">
                기업 주소
              </label>
              <input
                id="address"
                className={styles.input}
                placeholder="예: 서울특별시 강남구 테헤란로 123 테크빌딩 15층"
              />
            </div>
            <button className={styles.searchButton} type="button">
              주소 검색
            </button>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.cancelButton} type="button">
            취소
          </button>
          <button className={styles.saveButton} type="button">
            변경사항 저장
          </button>
        </div>
      </form>
    </section>
  )
}
