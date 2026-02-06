import styles from './guide-company.module.css'

export default function GuideCompanyPage() {
  return (
    <section className={styles.card} aria-label="Recruiting guide">
      <div className={styles.title}>채용 공고 가이드</div>
      <p className={styles.sub}>
        공고 작성 품질을 높이기 위한 체크리스트와 예시를 제공하는 페이지예요.
        <br />
        (데이터/기능 연결 전까지는 UI만 구성합니다.)
      </p>
      <div className={styles.list}>
        <div className={styles.item}>직무/레벨/근무 형태를 명확히</div>
        <div className={styles.item}>주요 업무는 5개 내외로</div>
        <div className={styles.item}>자격요건/우대사항을 분리</div>
        <div className={styles.item}>팀/프로젝트 소개는 구체적으로</div>
      </div>
    </section>
  )
}

