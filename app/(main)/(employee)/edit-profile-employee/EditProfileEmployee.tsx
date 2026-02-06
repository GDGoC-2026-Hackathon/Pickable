'use client'

import React, { useState, FormEvent, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { openDaumPostcode } from '@/lib/daum-postcode'

type ProfileData = {
  birthDate: string
  gender: string
  educationLevel: string
  major: string
  desiredJobRole: string
  desiredLocation: string | null
  desiredSalaryRange: string | null
  employmentType: string | null
  commuteStart: string | null
  commuteEnd: string | null
  militaryStatus: string
  skills: string[]
}

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

const GENDER_OPTIONS = [
  { value: 'MALE', label: '남성 (Male)' },
  { value: 'FEMALE', label: '여성 (Female)' },
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

export default function EditProfileEmployee() {
  const router = useRouter()
  const skillInputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef(false)
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<string>('MALE')
  const [educationLevel, setEducationLevel] = useState('')
  const [major, setMajor] = useState('')
  const [desiredJobRole, setDesiredJobRole] = useState('')
  const [desiredLocation, setDesiredLocation] = useState('')
  const [desiredSalaryRange, setDesiredSalaryRange] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [commuteStart, setCommuteStart] = useState('')
  const [commuteEnd, setCommuteEnd] = useState('')
  const [militaryStatus, setMilitaryStatus] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [profileLoadDone, setProfileLoadDone] = useState(false)

  function normalizeBirthDate(value: string | null | undefined) {
    if (!value) return ''

    // ISO string: 1990-01-01T00:00:00.000Z → 1990-01-01
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)

    // Some browsers allow 5~6 digit years in <input type="date"> via typing
    // e.g. 202026-01-01 → 2026-01-01
    if (/^\d{6}-\d{2}-\d{2}$/.test(value)) return value.slice(2)
    if (/^\d{5}-\d{2}-\d{2}$/.test(value)) return value.slice(1)

    // Digits only: 19900101 → 1990-01-01
    if (/^\d{8}$/.test(value))
      return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`

    return value
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const statusRes = await fetch('/api/signup/status')
        const statusData = await statusRes.json()
        const hasProfile = statusData?.data?.hasProfile === true
        const role = statusData?.data?.role
        if (cancelled || role !== 'JOB_SEEKER') {
          setProfileLoadDone(true)
          return
        }
        if (!hasProfile) {
          setIsEditMode(false)
          setProfileLoadDone(true)
          return
        }
        const profileRes = await fetch('/api/job-seeker/profile')
        if (!profileRes.ok || cancelled) {
          setProfileLoadDone(true)
          return
        }
        const profileJson = await profileRes.json()
        const p: ProfileData = profileJson?.data
        if (p) {
          setBirthDate(normalizeBirthDate(p.birthDate))
          setGender(p.gender ?? 'MALE')
          setEducationLevel(p.educationLevel ?? '')
          setMajor(p.major ?? '')
          setDesiredJobRole(p.desiredJobRole ?? '')
          setDesiredLocation(p.desiredLocation ?? '')
          setDesiredSalaryRange(p.desiredSalaryRange ?? '')
          setEmploymentType(p.employmentType ?? '')
          setCommuteStart(p.commuteStart ?? '')
          setCommuteEnd(p.commuteEnd ?? '')
          setMilitaryStatus(p.militaryStatus ?? '')
          setSkills(Array.isArray(p.skills) ? p.skills : [])
        }
        setIsEditMode(true)
      } catch {
        // ignore
      } finally {
        if (!cancelled) setProfileLoadDone(true)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleLocationSearch = useCallback(() => {
    openDaumPostcode((address) => setDesiredLocation(address)).catch(() =>
      setError('주소 검색 서비스를 불러올 수 없습니다.')
    )
  }, [])

  function addSkill(name: string) {
    const trimmed = name.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills((prev) => [...prev, trimmed])
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((s) => s !== name))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
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
    setError(null)
    setLoading(true)

    const body: Record<string, unknown> = {
      educationLevel,
      major: major.trim(),
      desiredJobRole: desiredJobRole.trim(),
      militaryStatus,
      birthDate: normalizeBirthDate(birthDate),
      gender,
    }
    if (desiredLocation.trim()) body.desiredLocation = desiredLocation.trim()
    if (desiredSalaryRange) body.desiredSalaryRange = desiredSalaryRange
    if (commuteStart) body.commuteStart = commuteStart
    if (commuteEnd) body.commuteEnd = commuteEnd
    if (employmentType) body.employmentType = employmentType
    if (skills.length > 0) body.skills = skills

    try {
      const url = isEditMode ? '/api/job-seeker/profile' : '/api/signup/job-seeker'
      const method = isEditMode ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error?.message ?? (isEditMode ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.'))
        return
      }
      router.replace(isEditMode ? '/my-page-employee' : '/main-page-employee')
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!profileLoadDone) {
    return (
      <div className="pe-page">
        <main className="pe-main">
          <div className="pe-container">
            <div className="pe-title-area">
              <p className="pe-subtitle">프로필을 불러오는 중...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="pe-page">
      <main className="pe-main">
        <div className="pe-container">
          <div className="pe-title-area">
            <div className="pe-eyebrow">JOB SEEKER SETUP</div>
            <h1 className="pe-title">
              {isEditMode ? '취업 준비생 프로필 수정하기' : '취업 준비생 프로필 등록하기'}
            </h1>
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

            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-user" aria-hidden>👤</span>
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
                    onChange={(e) => setBirthDate(normalizeBirthDate(e.target.value))}
                    required
                  />
                </div>
                <div className="pe-field">
                  <label className="pe-label">성별 <span style={{ color: '#dc2626' }}>*</span></label>
                  <div className="pe-seg">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`pe-seg-btn${gender === opt.value ? ' is-active' : ''}`}
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
                    {EDUCATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
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
                    {MILITARY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
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

            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-brief" aria-hidden>💼</span>
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
                  <label className="pe-label" htmlFor="desiredLocation">희망 근무지</label>
                  <div className="pe-address-inner">
                    <input
                      id="desiredLocation"
                      className="pe-input"
                      placeholder="예: 서울 강남구, 경기 판교"
                      value={desiredLocation}
                      onChange={(e) => setDesiredLocation(e.target.value)}
                    />
                    <button type="button" className="pe-search-btn" onClick={handleLocationSearch}>
                      주소 검색
                    </button>
                  </div>
                </div>
                <div className="pe-field">
                  <label className="pe-label" htmlFor="desiredSalaryRange">희망 연봉</label>
                  <select
                    id="desiredSalaryRange"
                    className="pe-input"
                    value={desiredSalaryRange}
                    onChange={(e) => setDesiredSalaryRange(e.target.value)}
                  >
                    {SALARY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pe-field">
                  <label className="pe-label" htmlFor="employmentType">고용 형태</label>
                  <select
                    id="employmentType"
                    className="pe-input"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    {EMPLOYMENT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="pe-field">
                  <label className="pe-label" htmlFor="commuteStart">선호 출근 시간</label>
                  <input
                    id="commuteStart"
                    type="time"
                    className="pe-input"
                    value={commuteStart}
                    onChange={(e) => setCommuteStart(e.target.value)}
                  />
                </div>
                <div className="pe-field">
                  <label className="pe-label" htmlFor="commuteEnd">선호 퇴근 시간</label>
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

            <section className="pe-card">
              <div className="pe-card-head">
                <span className="pe-icon pe-icon-skill" aria-hidden>💠</span>
                <h2 className="pe-card-title">전문 스킬</h2>
              </div>
              <p className="pe-help">보유 기술 스택을 추가해주세요.</p>
              <div className="pe-chips">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="pe-chip is-selected"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </button>
                ))}
                {showSkillInput ? (
                  <input
                    ref={skillInputRef}
                    className="pe-input"
                    style={{ width: '180px', height: '34px', borderRadius: '999px', padding: '0 14px', fontSize: '13px' }}
                    placeholder="스킬 입력 후 Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onCompositionStart={() => {
                      isComposingRef.current = true
                    }}
                    onCompositionEnd={() => {
                      isComposingRef.current = false
                    }}
                    onKeyDown={(e) => {
                      // IME(한글) 입력 중 Enter 처리 시 마지막 글자 중복/누락되는 문제 방지
                      // - composing 중에는 Enter를 무시하고, 조합이 끝난 다음 Enter에서 추가되도록 함
                      if (
                        e.key === 'Enter' &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        !(e.nativeEvent as any)?.isComposing &&
                        !isComposingRef.current
                      ) {
                        e.preventDefault()
                        addSkill(e.currentTarget.value)
                        setSkillInput('')
                        if (skillInputRef.current) skillInputRef.current.value = ''
                      }
                    }}
                    onBlur={(e) => {
                      if (isComposingRef.current) return
                      if (e.currentTarget.value.trim()) addSkill(e.currentTarget.value)
                      setSkillInput('')
                      setShowSkillInput(false)
                    }}
                    autoFocus
                  />
                ) : (
                  <button type="button" className="pe-chip pe-chip-add" onClick={() => setShowSkillInput(true)}>
                    + 직접 입력
                  </button>
                )}
              </div>
            </section>

            <div className="pe-cta">
              <button className="pe-cta-btn" type="submit" disabled={loading}>
                {loading
                  ? (isEditMode ? '저장 중...' : '등록 중...')
                  : isEditMode
                    ? '변경사항 저장'
                    : '프로필 등록하고 맞춤 공고 보기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
