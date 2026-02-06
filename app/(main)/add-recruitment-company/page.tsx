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

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="jobRole">
                  모집 직무
                </label>
                <input
                  id="jobRole"
                  className={styles.input}
                  placeholder="예: 시니어 백엔드 개발자 (Python/Django)"
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="location">
                    근무지
                  </label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.leftIcon} aria-hidden>
                      <PinIcon />
                    </span>
                    <input
                      id="location"
                      className={styles.inputInner}
                      placeholder="예: 서울특별시 강남구 테헤란로"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="deadline">
                    채용 마감일
                  </label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.leftIcon} aria-hidden>
                      <CalendarIcon />
                    </span>
                    <input id="deadline" className={styles.inputInner} type="date" />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="salary">
                  급여 조건
                </label>
                <input
                  id="salary"
                  className={styles.input}
                  placeholder="예: 면접 후 결정 (회사 내규에 따름)"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="preferred">
                  우대 조건
                </label>
                <textarea
                  id="preferred"
                  className={styles.textarea}
                  placeholder="해당 직무 수행에 우대되는 기술 스택이나 경험을 입력해주세요 (예: AWS 클라우드 숙련자, 영어 회화 가능자 등)"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="commute">
                    출퇴근 시간 설정
                  </label>
                  <span className={styles.hintChip}>
                    기업의 출퇴근 시간과 가장 잘 맞는 인재를 추천합니다.
                  </span>
                </div>
                <div className={styles.inputWithIcon}>
                  <span className={styles.leftIcon} aria-hidden>
                    <ClockIcon />
                  </span>
                  <input
                    id="commute"
                    className={styles.inputInner}
                    placeholder="09:00~18:00"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="applyUrl">
                  지원 링크 바로가기 URL
                </label>
                <div className={styles.inputWithIcon}>
                  <span className={styles.leftIcon} aria-hidden>
                    <LinkIcon />
                  </span>
                  <input
                    id="applyUrl"
                    className={styles.inputInner}
                    placeholder="https://careers.company.com/jobs/123"
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.rightCol} aria-label="미리보기/게시">
            <section className={styles.previewCard} aria-label="공고 미리보기">
              <div className={styles.previewTop}>
                <div className={styles.previewLogoRow}>
                  <div className={styles.previewLogoWrap} aria-hidden>
                    <img
                      className={styles.previewLogo}
                      src="/images/logo1.png"
                      alt=""
                    />
                  </div>
                  <div className={styles.heart} aria-hidden>
                    ♥
                  </div>
                </div>

                <div className={styles.previewName}>클라우드 펄스</div>
                <div className={styles.previewMeta}>SaaS 전문 중소기업</div>

                <div className={styles.badges}>
                  <span className={styles.badgeBlue}>매칭률 98%</span>
                  <span className={styles.badgeGreen}>채용 중</span>
                </div>

                <div className={styles.tagRow}>
                  <span className={styles.tag}>핀테크</span>
                  <span className={styles.tag}>유니콘</span>
                  <span className={styles.tag}>시리즈D</span>
                </div>
              </div>

              <div className={styles.previewBody}>
                <div className={styles.jobPreviewTitle}>Front-end Engineer</div>

                <div className={styles.kv}>
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>마감일</span>
                    <span className={styles.kvVal}>2025.03.20</span>
                  </div>
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>우대조건</span>
                    <span className={styles.kvVal}>경력 3년 이상</span>
                  </div>
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>근무지</span>
                    <span className={styles.kvVal}>광화문</span>
                  </div>
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>급여 조건</span>
                    <span className={styles.kvValStrong}>4000만원 이상</span>
                  </div>
                  <div className={styles.kvRow}>
                    <span className={styles.kvKey}>출퇴근 시간</span>
                    <span className={styles.kvValStrong}>09:00 ~ 18:00</span>
                  </div>
                </div>

                <button className={styles.applyButton} type="button">
                  지원하기
                </button>
              </div>
            </section>

            <button className={styles.publishButton} type="button">
              채용 공고 게시하기
              <span className={styles.publishIcon} aria-hidden>
                <PlaneIcon />
              </span>
            </button>

            <section className={styles.guideCard} aria-label="공고 등록 가이드">
              <div className={styles.guideTitle}>공고 등록 가이드</div>
              <ul className={styles.guideList}>
                <li>직무 키워드는 상세히 적을수록 AI 매칭 정확도가 올라갑니다.</li>
                <li>출퇴근 시간 데이터는 라이프스타일 매칭 점수에 반영됩니다.</li>
                <li>마감일은 공고 게시 후에도 수정이 가능합니다.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 3v3M17 3v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PlaneIcon() {
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
        d="M22 2 11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 2 15 22l-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

