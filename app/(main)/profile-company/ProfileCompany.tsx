// app/profile-company/ProfileCompany.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./ProfileCompany.css";

type CardMode = "upload" | "ai";

export default function ProfileCompany() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    industry: "IT / 소프트웨어",
    phone: "",
    address: "",
    coreValue: "",
    welfare: "",
    homepage: "",
  });

  const [mode, setMode] = useState<CardMode>("upload");
  const [prompt, setPrompt] = useState("");
  const [sampleFileName, setSampleFileName] = useState<string>("");

  const completionEnabled = useMemo(() => {
    // “등록 완료” 버튼 활성화 기준은 프로젝트에 맞게 바꾸면 됨
    return (
      form.companyName.trim().length > 0 &&
      form.address.trim().length > 0 &&
      (sampleFileName.length > 0 || prompt.trim().length > 0)
    );
  }, [form.companyName, form.address, sampleFileName, prompt]);

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSampleFileName(f ? f.name : "");
  };

  const onSubmit = () => {
    // TODO: API 연동
    console.log("submit", { ...form, mode, prompt, sampleFileName });
    alert("기업 프로필 등록(데모) 완료!");
    router.push("/branding-card-result-company");
  };

  return (
    <div className="pc-root">
      <div className="pc-wrap">
        {/* Title */}
        <div className="pc-titleBlock">
          <div className="pc-kicker">COMPANY SETUP</div>
          <h1 className="pc-title">기업 채용 프로필 설정</h1>
          <p className="pc-subtitle">
            기업의 핵심 가치와 채용 기준을 설정하여 최적의 인재를 확보하세요.
          </p>
        </div>

        {/* Section 1: Company Basic Info */}
        <section className="pc-card">
          <div className="pc-cardHeader">
            <div className="pc-badgeIcon" aria-hidden>
              <BuildingIcon />
            </div>
            <div>
              <div className="pc-cardTitle">기업 기본 정보</div>
            </div>
          </div>

          <div className="pc-form">
            <div className="pc-field">
              <label className="pc-label">업체명</label>
              <input
                className="pc-input"
                placeholder="공식 기업명을 입력해주세요"
                value={form.companyName}
                onChange={onChange("companyName")}
              />
            </div>

            <div className="pc-grid2">
              <div className="pc-field">
                <label className="pc-label">업종</label>
                <select className="pc-select" value={form.industry} onChange={onChange("industry")}>
                  <option>IT / 소프트웨어</option>
                  <option>제조 / 생산</option>
                  <option>금융 / 핀테크</option>
                  <option>교육 / 에듀테크</option>
                  <option>커머스 / 유통</option>
                  <option>콘텐츠 / 미디어</option>
                  <option>기타</option>
                </select>
              </div>

              <div className="pc-field">
                <label className="pc-label">전화번호</label>
                <input
                  className="pc-input"
                  placeholder="02-000-0000"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">주소</label>
              <input
                className="pc-input"
                placeholder="기업 소재지를 입력해주세요"
                value={form.address}
                onChange={onChange("address")}
              />
            </div>

            <div className="pc-field">
              <label className="pc-label">회사 한 줄 소개</label>
              <textarea
                className="pc-textarea"
                placeholder="기업의 핵심 비전을 입력해주세요"
                value={form.coreValue}
                onChange={onChange("coreValue")}
              />
            </div>

            <div className="pc-field">
              <label className="pc-label">회사 복지 소개</label>
              <textarea
                className="pc-textarea"
                placeholder="취업 준비생들에게 제공되었으면 하는 기업의 여러 복지 사항들을 입력해주세요"
                value={form.welfare}
                onChange={onChange("welfare")}
              />
            </div>

            <div className="pc-field">
              <label className="pc-label">홈페이지 URL</label>
              <input
                className="pc-input"
                placeholder="https://company.com"
                value={form.homepage}
                onChange={onChange("homepage")}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Branding card request */}
        <section className="pc-card">
          <div className="pc-cardHeader">
            <div className="pc-badgeIcon" aria-hidden>
              <CardIcon />
            </div>
            <div>
              <div className="pc-cardTitle">브랜딩 카드 제작 요청</div>
            </div>
          </div>

          <div className="pc-form">
            <div className="pc-grid2">
              {/* Left: sample image */}
              <div className="pc-field">
                <label className="pc-label">샘플 이미지</label>

                <div className="pc-modeRow">
                  <button
                    type="button"
                    className={`pc-modeBtn ${mode === "upload" ? "isActive" : ""}`}
                    onClick={() => setMode("upload")}
                  >
                    파일에서 찾기
                    {mode === "upload" && <span className="pc-check" aria-hidden>✓</span>}
                  </button>

                  <button
                    type="button"
                    className={`pc-modeBtn ${mode === "ai" ? "isActive" : ""}`}
                    onClick={() => setMode("ai")}
                  >
                    AI로 생성하기
                    {mode === "ai" && <span className="pc-check" aria-hidden>✓</span>}
                  </button>
                </div>

                <div className="pc-uploadBox">
                  {mode === "upload" ? (
                    <>
                      <input
                        id="pc-file"
                        type="file"
                        accept="image/*"
                        className="pc-fileInput"
                        onChange={onPickFile}
                      />
                      <label className="pc-uploadLabel" htmlFor="pc-file">
                        <span className="pc-uploadTitle">이미지 파일 업로드</span>
                        <span className="pc-uploadHint">
                          {sampleFileName ? sampleFileName : "PNG/JPG, 최대 10MB"}
                        </span>
                      </label>
                    </>
                  ) : (
                    <div className="pc-aiHint">
                      <div className="pc-aiHintTitle">AI로 샘플 이미지를 만들 수 있어요</div>
                      <div className="pc-aiHintSub">프롬프트를 작성하고 아래 “가이드”를 참고해보세요.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: prompt */}
              <div className="pc-field">
                <label className="pc-label">프롬프트 (하단의 가이드 참고)</label>
                <textarea
                  className="pc-textarea"
                  style={{ minHeight: 110 }}
                  placeholder="원하는 브랜딩 카드의 느낌을 자세하게 작성해주세요."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: AI branded card checklist */}
        <div className="pc-sectionTitleRow">
          <div className="pc-sectionIcon" aria-hidden>
            <SparkIcon />
          </div>
          <div className="pc-sectionTitle">AI 브랜딩 카드 품질 체크리스트</div>
        </div>

        <div className="pc-checkGrid">
          <ChecklistCard
            title="신뢰성"
            icon={<ShieldIcon />}
            items={["실제 사례 중심 작성", "내부 검토 과정 완료"]}
          />
          <ChecklistCard
            title="전달력"
            icon={<MegaphoneIcon />}
            items={["핵심 메시지 한 문장 정리", "읽는 구조가 이해도↑"]}
          />
          <ChecklistCard
            title="차별성"
            icon={<SparkSmallIcon />}
            items={["경쟁사 대비 차별 요소", "독특한 경험/철학 노출"]}
          />
        </div>

        {/* Section 4: Guide */}
        <div className="pc-sectionTitleRow">
          <div className="pc-sectionIcon" aria-hidden />
          <div className="pc-sectionTitle">AI 브랜딩 카드 제작 가이드</div>
        </div>

        <section className="pc-guideCard">
          <div className="pc-guideTop">
            <div className="pc-guidePill">
              <span className="pc-star" aria-hidden>★</span>
              AI 브랜딩 카드 작성 프롬프트 TIP
            </div>
            <div className="pc-guideDesc">
              더 나은 AI 생성 결과를 위해 아래 질문들에 답해보세요.
            </div>
          </div>

          <div className="pc-guideGrid">
            <GuideItem
              num="01"
              title="기업 핵심 강조하기"
              bullets={[
                "우리 회사가 해결하는 문제는 무엇인가?",
                "고객에게 제공하는 핵심 가치는 무엇인가?",
                "우리 회사만의 강점은 무엇인가?",
              ]}
            />
            <GuideItem
              num="03"
              title="커리어 성장 요소 포함하기"
              bullets={[
                "입사 후 어떤 역량을 개발할 수 있는가?",
                "팀의 성장/학습 문화는 어떤가?",
                "실제 성장 사례가 존재하는가?",
              ]}
            />
            <GuideItem
              num="02"
              title="조직 문화 표현하기"
              bullets={[
                "팀이 일하는 방식은 어떠한가?",
                "협업 방식과 의사결정 구조는 어떠한가?",
                "일하는 환경/리듬은 어떤가?",
              ]}
            />
            <GuideItem
              num="04"
              title="구체적인 사례 활용하기"
              bullets={[
                "실제 프로젝트 경험",
                "팀 성장 사례 및 직원 성장 사례",
                "성과를 수치로 표현 가능하면 더 좋음",
              ]}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pc-bottomBar">
          <button
            type="button"
            className={`pc-submit ${completionEnabled ? "isEnabled" : ""}`}
            onClick={onSubmit}
            disabled={!completionEnabled}
          >
            기업 프로필 등록 완료 <span className="pc-submitCheck" aria-hidden>✓</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChecklistCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="pc-miniCard">
      <div className="pc-miniTop">
        <div className="pc-miniIcon" aria-hidden>
          {icon}
        </div>
        <div className="pc-miniTitle">{title}</div>
      </div>
      <ul className="pc-miniList">
        {items.map((t) => (
          <li key={t} className="pc-miniItem">
            <span className="pc-bulletCheck" aria-hidden>✓</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GuideItem({ num, title, bullets }: { num: string; title: string; bullets: string[] }) {
  return (
    <div className="pc-guideItem">
      <div className="pc-guideNum">{num}</div>
      <div className="pc-guideBody">
        <div className="pc-guideTitle">{title}</div>
        <ul className="pc-guideList">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Simple inline icons (no deps) */
function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 10h2a2 2 0 0 1 2 2v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M8 8h4M8 12h4M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.3 5.2L18 9l-4.7 1.8L12 16l-1.3-5.2L6 9l4.7-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M5 20l.6-2.4L8 17l-2.4-.6L5 14l-.6 2.4L2 17l2.4.6L5 20Z" fill="currentColor" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9.5 12l1.6 1.6L14.8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MegaphoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11v2a2 2 0 0 0 2 2h1l3 3v-6l10-4V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 7V5a2 2 0 0 1 2-2h1v8h-1a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function SparkSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.1 4.4L17 9l-3.9 1.6L12 15l-1.1-4.4L7 9l3.9-1.6L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
