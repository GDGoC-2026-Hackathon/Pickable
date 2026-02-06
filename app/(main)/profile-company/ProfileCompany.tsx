// app/profile-company/ProfileCompany.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { openDaumPostcode } from "@/lib/daum-postcode";
import "./ProfileCompany.css";

type CardMode = "upload" | "ai";

type Step = "idle" | "saving" | "generating" | "done";

const COMPANY_SIZE_OPTIONS = [
  { value: "", label: "기업 규모를 선택해주세요" },
  { value: "STARTUP", label: "스타트업 (10인 미만)" },
  { value: "SMALL", label: "소규모 (10~50인)" },
  { value: "MEDIUM", label: "중규모 (50~100인)" },
  { value: "LARGE", label: "대규모 (100~300인)" },
  { value: "ENTERPRISE", label: "대기업 (300인 이상)" },
] as const;

const STEP_MESSAGES: Record<Step, string> = {
  idle: "",
  saving: "기업 프로필 저장 중...",
  generating: "AI 브랜딩 카드 생성 중...",
  done: "완료! 결과 페이지로 이동합니다.",
};

export default function ProfileCompany() {
  const router = useRouter();

  // ── 폼 state ──
  const [form, setForm] = useState({
    companyName: "",
    industry: "IT / 소프트웨어",
    companySize: "",
    phone: "",
    address: "",
    coreValue: "",
    welfare: "",
    homepage: "",
  });

  const [mode, setMode] = useState<CardMode>("upload");
  const [prompt, setPrompt] = useState("");
  const [sampleFileName, setSampleFileName] = useState<string>("");

  // ── 로딩 / 에러 ──
  const [pageLoading, setPageLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── 기존 프로필 로드 ──
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        // 1. 가입 상태 확인
        const statusRes = await fetch("/api/signup/status");
        if (!statusRes.ok) {
          setPageLoading(false);
          return;
        }
        const statusJson = await statusRes.json();
        const profileExists = statusJson?.data?.hasProfile === true;

        if (cancelled) return;
        setHasProfile(profileExists);

        // 2. 프로필이 있으면 기존 데이터 로드
        if (profileExists) {
          const profileRes = await fetch("/api/corporation/profile");
          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            const d = profileJson?.data;
            if (d && !cancelled) {
              setForm({
                companyName: d.name ?? "",
                industry: d.industry ?? "IT / 소프트웨어",
                companySize: d.companySize ?? "",
                phone: d.phone ?? "",
                address: d.address ?? "",
                coreValue: d.description ?? "",
                welfare: d.welfare ?? "",
                homepage: d.homepageUrl ?? "",
              });
            }
          }
        }
      } catch {
        // 네트워크 오류 등 — 빈 폼으로 진행
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── 완료 버튼 활성화 조건 ──
  const completionEnabled = useMemo(() => {
    return (
      form.companyName.trim().length > 0 &&
      form.address.trim().length > 0 &&
      form.companySize.length > 0 &&
      step === "idle"
    );
  }, [form.companyName, form.address, form.companySize, step]);

  // ── 핸들러 ──
  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSampleFileName(f ? f.name : "");
  };

  const onAddressSearch = useCallback(() => {
    openDaumPostcode((address) => {
      setForm((prev) => ({ ...prev, address }));
    }).catch(() => {
      setErrorMsg("주소 검색 서비스를 불러올 수 없습니다.");
    });
  }, []);

  // ── 제출: 프로필 저장 → AI 브랜딩 카드 생성 → 결과 페이지 ──
  const onSubmit = async () => {
    setErrorMsg(null);

    // 유효성 검사
    if (!form.companyName.trim()) {
      setErrorMsg("업체명을 입력해주세요.");
      return;
    }
    if (!form.companySize) {
      setErrorMsg("기업 규모를 선택해주세요.");
      return;
    }
    if (!form.address.trim()) {
      setErrorMsg("주소를 입력해주세요.");
      return;
    }

    try {
      // ─── Step 1: 프로필 저장 / 수정 ───
      setStep("saving");

      const profilePayload = {
        name: form.companyName.trim(),
        industry: form.industry.trim(),
        companySize: form.companySize,
        address: form.address.trim(),
        description: form.coreValue.trim() || undefined,
        welfare: form.welfare.trim() || undefined,
        homepageUrl: form.homepage.trim() || undefined,
        phone: form.phone.trim() || undefined,
      };

      let profileOk = false;

      if (hasProfile) {
        // 이미 등록된 기업 → PATCH 수정
        const res = await fetch("/api/corporation/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error?.message || "프로필 수정에 실패했습니다.");
        }
        profileOk = true;
      } else {
        // 신규 등록 → POST
        const res = await fetch("/api/signup/corporation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profilePayload),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.error?.message || "프로필 등록에 실패했습니다.");
        }
        profileOk = true;
        setHasProfile(true);
      }

      if (!profileOk) throw new Error("프로필 저장에 실패했습니다.");

      // ─── Step 2: AI 브랜딩 카드 생성 ───
      setStep("generating");

      const generatePayload: Record<string, string> = {};
      if (prompt.trim()) generatePayload.prompt = prompt.trim();
      if (form.companyName.trim()) generatePayload.companyName = form.companyName.trim();
      if (form.homepage.trim()) generatePayload.companyUrl = form.homepage.trim();
      if (form.coreValue.trim()) generatePayload.companyDesc = form.coreValue.trim();

      const genRes = await fetch("/api/corporation/branding-card/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatePayload),
      });

      if (!genRes.ok) {
        const errJson = await genRes.json().catch(() => null);
        throw new Error(errJson?.error?.message || "AI 브랜딩 카드 생성에 실패했습니다.");
      }

      // ─── Step 3: 결과 페이지로 이동 ───
      setStep("done");
      sessionStorage.setItem("pickable:snackbar", "AI 브랜딩 카드가 생성되었습니다!");
      router.push("/branding-card-result-company");
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setErrorMsg(message);
      setStep("idle");
    }
  };

  // ── 페이지 로딩 중 ──
  if (pageLoading) {
    return (
      <div className="pc-root">
        <div className="pc-wrap">
          <div className="pc-loadingPage">
            <div className="pc-spinner" />
            <p>기업 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <label className="pc-label">업체명 <span className="pc-required">*</span></label>
              <input
                className="pc-input"
                placeholder="공식 기업명을 입력해주세요"
                value={form.companyName}
                onChange={onChange("companyName")}
                disabled={step !== "idle"}
              />
            </div>

            <div className="pc-grid2">
              <div className="pc-field">
                <label className="pc-label">업종</label>
                <select className="pc-select" value={form.industry} onChange={onChange("industry")} disabled={step !== "idle"}>
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
                <label className="pc-label">기업 규모 <span className="pc-required">*</span></label>
                <select className="pc-select" value={form.companySize} onChange={onChange("companySize")} disabled={step !== "idle"}>
                  {COMPANY_SIZE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pc-grid2">
              <div className="pc-field">
                <label className="pc-label">전화번호</label>
                <input
                  className="pc-input"
                  placeholder="02-000-0000"
                  value={form.phone}
                  onChange={onChange("phone")}
                  disabled={step !== "idle"}
                />
              </div>

              <div className="pc-field">
                <label className="pc-label">홈페이지 URL</label>
                <input
                  className="pc-input"
                  placeholder="https://company.com"
                  value={form.homepage}
                  onChange={onChange("homepage")}
                  disabled={step !== "idle"}
                />
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">주소 <span className="pc-required">*</span></label>
              <div className="pc-addressRow">
                <input
                  className="pc-input pc-addressInput"
                  placeholder="기업 소재지 (주소 검색 클릭)"
                  value={form.address}
                  onChange={onChange("address")}
                  onClick={onAddressSearch}
                  disabled={step !== "idle"}
                />
                <button
                  type="button"
                  className="pc-addressBtn"
                  onClick={onAddressSearch}
                  disabled={step !== "idle"}
                >
                  주소 검색
                </button>
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">회사 한 줄 소개</label>
              <textarea
                className="pc-textarea"
                placeholder="기업의 핵심 비전을 입력해주세요"
                value={form.coreValue}
                onChange={onChange("coreValue")}
                disabled={step !== "idle"}
              />
            </div>

            <div className="pc-field">
              <label className="pc-label">회사 복지 소개</label>
              <textarea
                className="pc-textarea"
                placeholder="취업 준비생들에게 제공되었으면 하는 기업의 여러 복지 사항들을 입력해주세요"
                value={form.welfare}
                onChange={onChange("welfare")}
                disabled={step !== "idle"}
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
                    disabled={step !== "idle"}
                  >
                    파일에서 찾기
                    {mode === "upload" && <span className="pc-check" aria-hidden>✓</span>}
                  </button>

                  <button
                    type="button"
                    className={`pc-modeBtn ${mode === "ai" ? "isActive" : ""}`}
                    onClick={() => setMode("ai")}
                    disabled={step !== "idle"}
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
                        disabled={step !== "idle"}
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
                      <div className="pc-aiHintSub">프롬프트를 작성하고 아래 &quot;가이드&quot;를 참고해보세요.</div>
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
                  disabled={step !== "idle"}
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

        {/* Error message */}
        {errorMsg && (
          <div className="pc-errorBar">
            <span className="pc-errorIcon">!</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Progress overlay */}
        {step !== "idle" && (
          <div className="pc-progressBar">
            <div className="pc-spinner" />
            <span className="pc-progressText">{STEP_MESSAGES[step]}</span>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pc-bottomBar">
          <button
            type="button"
            className={`pc-submit ${completionEnabled ? "isEnabled" : ""}`}
            onClick={onSubmit}
            disabled={!completionEnabled}
          >
            {hasProfile ? "프로필 수정 및 브랜딩 카드 생성" : "기업 프로필 등록 완료"}
            <span className="pc-submitCheck" aria-hidden>✓</span>
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
