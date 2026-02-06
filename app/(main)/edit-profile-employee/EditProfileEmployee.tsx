'use client'

import React, { useState, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { openDaumPostcode } from '@/lib/daum-postcode'
import '../profile-employee/ProfileEmployee.css'

// ── Enum 옵션 ──

const EDUCATION_OPTIONS = [
  { value: 'HIGH_SCHOOL', label: '고등학교 졸업' },
  { value: 'ASSOCIATE', label: '전문학사 (2·3년제)' },
  { value: 'BACHELOR', label: '학사 (4년제)' },
  { value: 'MASTER', label: '석사' },
  { value: 'DOCTORATE', label: '박사' },
] as const

const MILITARY_OPTIONS = [
  { value: 'NOT_APPLICABLE', label: '해당 없음' },
  { value: 'COMPLETED', label: '군필' },
  { value: 'EXEMPT', label: '면제' },
  { value: 'SERVING', label: '복무 중' },
  { value: 'NOT_COMPLETED', label: '미필' },
] as const

const SALARY_OPTIONS = [
  { value: '', label: '선택 안 함' },
  { value: 'UNDER_2400', label: '2,400만원 미만' },
  { value: 'RANGE_2400_3000', label: '2,400 ~ 3,000만원' },
  { value: 'RANGE_3000_3600', label: '3,000 ~ 3,600만원' },
  { value: 'RANGE_3600_4200', label: '3,600 ~ 4,200만원' },
  { value: 'RANGE_4200_5000', label: '4,200 ~ 5,000만원' },
  { value: 'OVER_5000', label: '5,000만원 이상' },
] as const

const EMPLOYMENT_OPTIONS = [
  { value: '', label: '선택 안 함' },
  { value: 'FULL_TIME', label: '정규직' },
  { value: 'CONTRACT', label: '계약직' },
  { value: 'INTERN', label: '인턴' },
  { value: 'FREELANCE', label: '프리랜서' },
] as const

const GENDER_OPTIONS = [
  { value: 'MALE', label: '남성 (Male)' },
  { value: 'FEMALE', label: '여성 (Female)' },
] as const

// ── 컴포넌트 ──

export default function EditProfileEmployee() {
  const router = useRouter()

  // 기본 정보
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<string>('MALE')
  const [educationLevel, setEducationLevel] = useState('')
  const [major, setMajor] = useState('')

  // 선호 근무 조건
  const [desiredJobRole, setDesiredJobRole] = useState('')
  const [desiredLocation, setDesiredLocation] = useState('')
  const [desiredSalaryRange, setDesiredSalaryRange] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [commuteStart, setCommuteStart] = useState('')
  const [commuteEnd, setCommuteEnd] = useState('')

  // 병역
  const [militaryStatus, setMilitaryStatus] = useState('')

  // 스킬
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [showSkillInput, setShowSkillInput] = useState(false)

  // UI 상태
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── 스킬 관리 ──

  function addSkill(name: string) {
    const trimmed = name.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills((prev) => [...prev, trimmed])
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((s) => s !== name))
  }

  function handleSkillInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(skillInput)
      setSkillInput('')
    }
  }

  // ── 희망 근무지 (우편번호 API) ──

  const handleLocationSearch = useCallback(() => {
    openDaumPostcode((address) => {
      setDesiredLocation(address)
    }).catch(() => {
      setError('주소 검색 서비스를 불러올 수 없습니다.')
    })
  }, [])

  // ── 제출 ──

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // 클라이언트 필수 필드 검증
    if (!educationLevel) {
      setError('최종학력을 선택해주세요.')
      return
    }
    if (!major.trim()) {
      setError('전공을 입력해주세요.')
      return
    }
    if (!desiredJobRole.trim()) {
      setError('희망 직군/직무를 입력해주세요.')
      return
    }
    if (!militaryStatus) {
      setError('병역 사항을 선택해주세요.')
      return
    }
    if (!birthDate) {
      setError('생년월일을 입력해주세요.')
      return
    }
    if (!gender) {
      setError('성별을 선택해주세요.')
      return
    }

    setError(null)
    setLoading(true)

    // API 요청 바디 구성
    const body: Record<string, unknown> = {
      educationLevel,
      major: major.trim(),
      desiredJobRole: desiredJobRole.trim(),
      militaryStatus,
      birthDate, // "YYYY-MM-DD"
      gender,
    }

    // 선택 필드 (값이 있을 때만 전송)
    if (desiredLocation.trim()) body.desiredLocation = desiredLocation.trim()
    if (desiredSalaryRange) body.desiredSalaryRange = desiredSalaryRange
    if (commuteStart) body.commuteStart = commuteStart
    if (commuteEnd) body.commuteEnd = commuteEnd
    if (employmentType) body.employmentType = employmentType
    if (skills.length > 0) body.skills = skills

    try {
      const res = await fetch('/api/signup/job-seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data?.error?.message ?? '등록 중 오류가 발생했습니다.'
        setError(msg)
        return
      }

      // 등록 성공 → 홈으로 이동
      router.replace('/')
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pe-page">
      <main className="pe-main">
        <div className="pe-container">
          <div className="pe-title-area">
            <div className="pe-eyebrow">JOB SEEKER SETUP</div>
            <h1 className="pe-title">취업 준비생 프로필 등록하기</h1>
            <p className="pe-subtitle">
              AI가 당신의 역량과 라이프스타일을 분석하여 최적의 기업을 찾아드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  margin: '0 0 16px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Card 1: 기본 정보 */}
            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-user" aria-hidden="true">
                  👤
                </span>
                <h2 className="pe-card-title">기본 정보</h2>
              </div>

              <div className="pe-grid pe-grid-2">
                <div className="pe-field">
                  <label className="pe-label" htmlFor="birthDate">
                    생년월일 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    className="pe-input"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>

                <div className="pe-field">
                  <label className="pe-label">
                    성별 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div className="pe-seg">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`pe-seg-btn${gender === opt.value ? ' is-active' : ''}`}
                        type="button"
                        onClick={() => setGender(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="educationLevel">
                    최종학력 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="educationLevel"
                    className="pe-input"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    required
                  >
                    <option value="">선택해주세요</option>
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="militaryStatus">
                    병역 사항 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    id="militaryStatus"
                    className="pe-input"
                    value={militaryStatus}
                    onChange={(e) => setMilitaryStatus(e.target.value)}
                    required
                  >
                    <option value="">선택해주세요</option>
                    {MILITARY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pe-field pe-span-2">
                  <label className="pe-label" htmlFor="major">
                    전공 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="major"
                    className="pe-input"
                    placeholder="전공명을 입력해주세요 (예: 컴퓨터공학)"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Card 2: 선호 근무 조건 */}
            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-brief" aria-hidden="true">
                  💼
                </span>
                <h2 className="pe-card-title">선호 근무 조건</h2>
              </div>

              <div className="pe-grid pe-grid-2">
                <div className="pe-field">
                  <label className="pe-label" htmlFor="desiredJobRole">
                    희망 직군/직무 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id="desiredJobRole"
                    className="pe-input"
                    placeholder="예: 백엔드 개발, 프론트엔드 개발"
                    value={desiredJobRole}
                    onChange={(e) => setDesiredJobRole(e.target.value)}
                    required
                  />
                </div>

                <div className="pe-field pe-address-row">
                  <label className="pe-label" htmlFor="desiredLocation">
                    희망 근무지
                  </label>
                  <div className="pe-address-inner">
                    <input
                      id="desiredLocation"
                      className="pe-input"
                      placeholder="예: 서울 강남구, 경기 판교"
                      value={desiredLocation}
                      onChange={(e) => setDesiredLocation(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pe-search-btn"
                      onClick={handleLocationSearch}
                    >
                      주소 검색
                    </button>
                  </div>
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="desiredSalaryRange">
                    희망 연봉
                  </label>
                  <select
                    id="desiredSalaryRange"
                    className="pe-input"
                    value={desiredSalaryRange}
                    onChange={(e) => setDesiredSalaryRange(e.target.value)}
                  >
                    {SALARY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="employmentType">
                    고용 형태
                  </label>
                  <select
                    id="employmentType"
                    className="pe-input"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    {EMPLOYMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="commuteStart">
                    선호 출근 시간
                  </label>
                  <input
                    id="commuteStart"
                    type="time"
                    className="pe-input"
                    value={commuteStart}
                    onChange={(e) => setCommuteStart(e.target.value)}
                  />
                </div>

                <div className="pe-field">
                  <label className="pe-label" htmlFor="commuteEnd">
                    선호 퇴근 시간
                  </label>
                  <input
                    id="commuteEnd"
                    type="time"
                    className="pe-input"
                    value={commuteEnd}
                    onChange={(e) => setCommuteEnd(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Card 3: 전문 스킬 */}
            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-skill" aria-hidden="true">
                  💠
                </span>
                <h2 className="pe-card-title">전문 스킬</h2>
              </div>

              <p className="pe-help">
                보유 기술 스택을 추가해주세요. AI 매칭에 활용됩니다.
              </p>

              <div className="pe-chips">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    className="pe-chip is-selected"
                    type="button"
                    onClick={() => removeSkill(skill)}
                    title="클릭하여 제거"
                  >
                    {skill} &times;
                  </button>
                ))}

                {showSkillInput ? (
                  <input
                    className="pe-input"
                    style={{
                      width: '180px',
                      height: '34px',
                      borderRadius: '999px',
                      padding: '0 14px',
                      fontSize: '13px',
                    }}
                    placeholder="스킬명 입력 후 Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillInputKeyDown}
                    onBlur={() => {
                      if (skillInput.trim()) addSkill(skillInput)
                      setSkillInput('')
                      setShowSkillInput(false)
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    className="pe-chip pe-chip-add"
                    type="button"
                    onClick={() => setShowSkillInput(true)}
                  >
                    + 직접 입력
                  </button>
                )}
              </div>
            </section>

            {/* CTA */}
            <div className="pe-cta">
              <button
                className="pe-cta-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? '등록 중...' : '프로필 등록하고 매칭 시작하기 ›'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
