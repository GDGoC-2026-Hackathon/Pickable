import styles from './RecruitmentCard.module.css'

type BadgeTone = "blue" | "green" | "gray";

/** 공통 */
type BaseProps = {
  companyName: string;
  companyDesc?: string;
  matchRate?: number;
  hiringLabel?: string;
  tags?: string[];
  liked?: boolean;
};

/** preview 전용: 상세 필드 필요 없음 + image 필수 */
type PreviewProps = BaseProps & {
  variant: "preview";
  image: string;
};

/** default 전용: 상세 필드 필수 + variant 생략 가능(기본값 default) */
type DefaultProps = BaseProps & {
  variant?: "default";
  positionTitle: string;
  deadline: string;
  experience: string;
  location: string;
  salary: string;
  workTime: string;
};

/** back 전용: 상세 요약형 (브랜딩 카드용) */
type BackProps = Omit<DefaultProps, "variant"> & {
  variant: "back";
};

export type RecruitmentCardProps = PreviewProps | DefaultProps | BackProps;

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  const toneClass =
    tone === 'blue'
      ? styles.badgeBlue
      : tone === 'green'
        ? styles.badgeGreen
        : undefined
  return <span className={`${styles.badge} ${toneClass ?? ''}`}>{children}</span>
}

export default function RecruitmentCard(props: RecruitmentCardProps) {
  /** ✅ preview 분기: 여기서 props는 PreviewProps로 좁혀짐 */
  if (props.variant === "preview") {
    const {
      companyName,
      companyDesc = "SaaS 전문 강소기업",
      matchRate = 0,
      tags = [],
      image,
    } = props;

    return (
      <div className={styles.preview} style={{ backgroundImage: `url(${image})` }}>
        <div className={styles.previewOverlay} />

        <div className={styles.previewTop}>
          <span className={styles.previewMatch}>MATCH {matchRate}%</span>
        </div>

        <div className={styles.previewBottom}>
          <div className={styles.previewCompanyName}>{companyName}</div>
          <div className={styles.previewCompanyDesc}>{companyDesc}</div>

          <div className={styles.previewTags}>
            {tags.map((t) => (
              <span key={t} className={styles.previewTag}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /** ✅ 여기부터는 props가 DefaultProps | BackProps로 좁혀짐 */
  const {
    companyName,
    companyDesc = "SaaS 전문 강소기업",
    matchRate = 98,
    hiringLabel = "채용 중",
    tags = ["핀테크", "유니콘", "시리즈D"],
    positionTitle,
    deadline,
    experience,
    location,
    salary,
    workTime,
    liked = false,
  } = props;

  if (props.variant === "back") {
    return (
      <article className={`${styles.card} ${styles.cardBack}`}>
        <div className={styles.backCompany}>
          <div className={styles.companyName}>{companyName}</div>
          <div className={styles.companyDesc}>{companyDesc}</div>
        </div>

        <div className={styles.backBadges}>
          <Badge tone="green">{hiringLabel}</Badge>
        </div>

        <div className={`${styles.meta} ${styles.backMeta}`}>
          <div className={styles.row}>
            <span className={styles.key}>마감일</span>
            <span className={styles.val}>{deadline}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>우대조건</span>
            <span className={styles.val}>{experience}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>근무지</span>
            <span className={styles.val}>{location}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>급여 조건</span>
            <span className={`${styles.val} ${styles.strong}`}>{salary}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>출퇴근 시간</span>
            <span className={`${styles.val} ${styles.strong}`}>{workTime}</span>
          </div>
        </div>

        <button className={styles.apply} type="button">
          지원하기
        </button>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.logo} aria-hidden="true">
          <div className={styles.logoInner}>✳</div>
        </div>

        <button
          className={`${styles.like} ${liked ? styles.liked : ''}`}
          type="button"
          aria-label="관심 공고"
          title="관심"
        >
          ♥
        </button>
      </div>

      <div className={styles.company}>
        <div className={styles.companyName}>{companyName}</div>
        <div className={styles.companyDesc}>{companyDesc}</div>
      </div>

      <div className={styles.badges}>
        <Badge tone="blue">매칭률 {matchRate}%</Badge>
        <Badge tone="green">{hiringLabel}</Badge>
      </div>

      <div className={styles.tags}>
        {tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.position}>{positionTitle}</div>

      <div className={styles.meta}>
        <div className={styles.row}>
          <span className={styles.key}>마감일</span>
          <span className={styles.val}>{deadline}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>우대조건</span>
          <span className={styles.val}>{experience}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>근무지</span>
          <span className={styles.val}>{location}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>급여 조건</span>
          <span className={`${styles.val} ${styles.strong}`}>{salary}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>출퇴근 시간</span>
          <span className={`${styles.val} ${styles.strong}`}>{workTime}</span>
        </div>
      </div>

      <button className={styles.apply} type="button">
        지원하기
      </button>
    </article>
  );
}
