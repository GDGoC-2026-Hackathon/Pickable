import React from "react";
import "./RecruitmentCard.css";

type BadgeTone = "blue" | "green" | "gray";

export type RecruitmentCardProps = {
  variant?: "default" | "preview";

  companyName: string;
  companyDesc?: string; // ex) "SaaS 전문 강소기업"
  matchRate?: number;   // ex) 98
  hiringLabel?: string; // ex) "채용 중"
  tags?: string[];      // ex) ["핀테크", "유니콘", "시리즈D"]

  positionTitle: string; // ex) "Front-end Engineer"
  deadline: string;      // ex) "2025.03.20"
  experience: string;    // ex) "경력 3년 이상"
  location: string;      // ex) "광화문"
  salary: string;        // ex) "4000만원 이상"
  workTime: string;      // ex) "09:00 ~ 18:00"

  liked?: boolean;
  /** preview 전용 */
  image?: string;
};

function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return <span className={`rc-badge rc-badge-${tone}`}>{children}</span>;
}

export default function RecruitmentCard(props: RecruitmentCardProps) {
  const {
    variant = "default",
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

  if (variant === "preview") {
    const {
      companyName,
      companyDesc,
      matchRate = 0,
      tags = [],
      image,
    } = props;

    return (
      <div
        className="rc-preview"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="rc-preview-overlay" />

        <div className="rc-preview-top">
          <span className="rc-preview-match">
            MATCH {matchRate}%
          </span>
        </div>

        <div className="rc-preview-bottom">
          <strong>{companyName}</strong>
          <p>{companyDesc}</p>

          <div className="rc-preview-tags">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <article className="rc-card">
      <div className="rc-top">
        <div className="rc-logo" aria-hidden="true">
          <div className="rc-logo-inner">✳</div>
        </div>

        <button
          className={`rc-like ${liked ? "is-liked" : ""}`}
          type="button"
          aria-label="관심 공고"
          title="관심"
        >
          ♥
        </button>
      </div>

      <div className="rc-company">
        <div className="rc-company-name">{companyName}</div>
        <div className="rc-company-desc">{companyDesc}</div>
      </div>

      <div className="rc-badges">
        <Badge tone="blue">매칭률 {matchRate}%</Badge>
        <Badge tone="green">{hiringLabel}</Badge>
      </div>

      <div className="rc-tags">
        {tags.map((t) => (
          <span key={t} className="rc-tag">
            {t}
          </span>
        ))}
      </div>

      <div className="rc-divider" />

      <div className="rc-position">{positionTitle}</div>

      <div className="rc-meta">
        <div className="rc-row">
          <span className="rc-key">마감일</span>
          <span className="rc-val">{deadline}</span>
        </div>
        <div className="rc-row">
          <span className="rc-key">우대조건</span>
          <span className="rc-val">{experience}</span>
        </div>
        <div className="rc-row">
          <span className="rc-key">근무지</span>
          <span className="rc-val">{location}</span>
        </div>
        <div className="rc-row">
          <span className="rc-key">급여 조건</span>
          <span className="rc-val strong">{salary}</span>
        </div>
        <div className="rc-row">
          <span className="rc-key">출퇴근 시간</span>
          <span className="rc-val strong">{workTime}</span>
        </div>
      </div>

      <button className="rc-apply" type="button">
        지원하기
      </button>
    </article>
  );
}
