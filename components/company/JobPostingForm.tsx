'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import type {
  CreateJobPostingRequest,
  UpdateJobPostingRequest,
  JobPostingDetail,
} from '@/types/job-posting'
import {
  EDUCATION_LEVEL_OPTIONS,
  FILTER_POLICY_OPTIONS,
  SALARY_RANGE_OPTIONS,
  JOB_TRACK_EXAMPLES,
} from '@/lib/constants/job-posting-options'
import { openDaumPostcode } from '@/lib/daum-postcode'

import styles from './JobPostingForm.module.css'

// ── Props ──

type JobPostingFormProps =
  | { mode: 'create' }
  | { mode: 'edit'; postingId: string; initialData: JobPostingDetail }

// ── 폼 상태 타입 ──

type FormState = {
  title: string
  jobTrack: string
  minEducationLevel: string
  militaryPolicy: string
  careerPolicy: string
  deadline: string
  preferredCondition: string
  salaryRange: string
  salaryDescription: string
  location: string
  workStart: string
  workEnd: string
  applicationUrl: string
  aiEvalCredential: boolean
  aiEvalExperience: boolean
  aiEvalAward: boolean
  skills: string
}

function getInitialState(props: JobPostingFormProps): FormState {
  if (props.mode === 'edit') {
    const d = props.initialData
    return {
      title: d.title,
      jobTrack: d.jobTrack,
      minEducationLevel: d.minEducationLevel,
      militaryPolicy: d.militaryPolicy,
      careerPolicy: d.careerPolicy,
      deadline: d.deadline ? d.deadline.slice(0, 10) : '',
      preferredCondition: d.preferredCondition ?? '',
      salaryRange: d.salaryRange ?? '',
      salaryDescription: d.salaryDescription ?? '',
      location: d.location ?? '',
      workStart: d.workStart ?? '',
      workEnd: d.workEnd ?? '',
      applicationUrl: d.applicationUrl ?? '',
      aiEvalCredential: d.aiEvalCredential,
      aiEvalExperience: d.aiEvalExperience,
      aiEvalAward: d.aiEvalAward,
      skills: d.skills.join(', '),
    }
  }

  return {
    title: '',
    jobTrack: '',
    minEducationLevel: 'BACHELOR',
    militaryPolicy: 'NOT_RELEVANT',
    careerPolicy: 'NOT_RELEVANT',
    deadline: '',
    preferredCondition: '',
    salaryRange: '',
    salaryDescription: '',
    location: '',
    workStart: '',
    workEnd: '',
    applicationUrl: '',
    aiEvalCredential: false,
    aiEvalExperience: false,
    aiEvalAward: false,
    skills: '',
  }
}

// ── 컴포넌트 ──

export function JobPostingForm(props: JobPostingFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => getInitialState(props))
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isEdit = props.mode === 'edit'

  // 주소 검색 핸들러
  const handleAddressSearch = useCallback(() => {
    openDaumPostcode((address) => {
      update('location', address)
    })
  }, [])

  // 필드 변경 헬퍼
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // 제출 핸들러
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    // 클라이언트 기본 검증
    if (!form.title.trim()) {
      setErrorMsg('모집 직무(title)를 입력해주세요.')
      return
    }
    if (!form.jobTrack.trim()) {
      setErrorMsg('직무 트랙(jobTrack)을 선택해주세요.')
      return
    }

    setSubmitting(true)

    try {
      const skillsArr = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      if (isEdit) {
        // PATCH
        const body: UpdateJobPostingRequest = {
          title: form.title,
          jobTrack: form.jobTrack,
          minEducationLevel: form.minEducationLevel as CreateJobPostingRequest['minEducationLevel'],
          militaryPolicy: form.militaryPolicy as CreateJobPostingRequest['militaryPolicy'],
          careerPolicy: form.careerPolicy as CreateJobPostingRequest['careerPolicy'],
          deadline: form.deadline || null,
          preferredCondition: form.preferredCondition || null,
          salaryRange: (form.salaryRange || null) as CreateJobPostingRequest['salaryRange'],
          salaryDescription: form.salaryDescription || null,
          location: form.location || null,
          workStart: form.workStart || null,
          workEnd: form.workEnd || null,
          applicationUrl: form.applicationUrl || null,
          aiEvalCredential: form.aiEvalCredential,
          aiEvalExperience: form.aiEvalExperience,
          aiEvalAward: form.aiEvalAward,
          skills: skillsArr,
        }

        const res = await fetch(
          `/api/corporation/job-postings/${props.postingId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        )

        const json = await res.json()
        if (!res.ok) {
          setErrorMsg(json?.error?.message ?? '수정에 실패했습니다.')
          return
        }

        router.push('/dashboard-company')
        router.refresh()
      } else {
        // POST
        const body: CreateJobPostingRequest = {
          title: form.title,
          jobTrack: form.jobTrack,
          minEducationLevel: form.minEducationLevel as CreateJobPostingRequest['minEducationLevel'],
          militaryPolicy: form.militaryPolicy as CreateJobPostingRequest['militaryPolicy'],
          careerPolicy: form.careerPolicy as CreateJobPostingRequest['careerPolicy'],
          ...(form.deadline && { deadline: form.deadline }),
          ...(form.preferredCondition && {
            preferredCondition: form.preferredCondition,
          }),
          ...(form.salaryRange && {
            salaryRange: form.salaryRange as CreateJobPostingRequest['salaryRange'],
          }),
          ...(form.salaryDescription && {
            salaryDescription: form.salaryDescription,
          }),
          ...(form.location && { location: form.location }),
          ...(form.workStart && { workStart: form.workStart }),
          ...(form.workEnd && { workEnd: form.workEnd }),
          ...(form.applicationUrl && { applicationUrl: form.applicationUrl }),
          aiEvalCredential: form.aiEvalCredential,
          aiEvalExperience: form.aiEvalExperience,
          aiEvalAward: form.aiEvalAward,
          ...(skillsArr.length > 0 && { skills: skillsArr }),
        }

        const res = await fetch('/api/corporation/job-postings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const json = await res.json()
        if (!res.ok) {
          setErrorMsg(json?.error?.message ?? '등록에 실패했습니다.')
          return
        }

        router.push('/dashboard-company')
        router.refresh()
      }
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      {/* ── 모집 직무 (필수) ── */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">
          모집 직무 <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          className={styles.input}
          placeholder="예: 시니어 백엔드 개발자 (Python/Django)"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>

      {/* ── 직무 트랙 (필수) ── */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="jobTrack">
          직무 트랙 <span className={styles.required}>*</span>
        </label>
        <select
          id="jobTrack"
          className={styles.select}
          value={form.jobTrack}
          onChange={(e) => update('jobTrack', e.target.value)}
        >
          <option value="">선택해주세요</option>
          {JOB_TRACK_EXAMPLES.map((track) => (
            <option key={track} value={track}>
              {track}
            </option>
          ))}
        </select>
      </div>

      {/* ── Hard Filter (필수) ── */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="minEducationLevel">
            최소 학력 요건 <span className={styles.required}>*</span>
          </label>
          <select
            id="minEducationLevel"
            className={styles.select}
            value={form.minEducationLevel}
            onChange={(e) => update('minEducationLevel', e.target.value)}
          >
            {EDUCATION_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="militaryPolicy">
            병역 정책 <span className={styles.required}>*</span>
          </label>
          <select
            id="militaryPolicy"
            className={styles.select}
            value={form.militaryPolicy}
            onChange={(e) => update('militaryPolicy', e.target.value)}
          >
            {FILTER_POLICY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="careerPolicy">
          경력 정책 <span className={styles.required}>*</span>
        </label>
        <select
          id="careerPolicy"
          className={styles.select}
          value={form.careerPolicy}
          onChange={(e) => update('careerPolicy', e.target.value)}
        >
          {FILTER_POLICY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── 조건 (선택) ── */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="location">
            근무지
          </label>
          <div className={styles.inputWithButton}>
            <input
              id="location"
              className={styles.inputInner}
              placeholder="주소 검색 버튼을 눌러주세요"
              value={form.location}
              readOnly
              onClick={handleAddressSearch}
            />
            <button
              type="button"
              className={styles.searchButton}
              onClick={handleAddressSearch}
            >
              <PinIcon />
              주소 검색
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="deadline">
            채용 마감일
          </label>
          <input
            id="deadline"
            type="date"
            className={styles.input}
            value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="salaryRange">
            급여 범위
          </label>
          <select
            id="salaryRange"
            className={styles.select}
            value={form.salaryRange}
            onChange={(e) => update('salaryRange', e.target.value)}
          >
            <option value="">선택 안 함</option>
            {SALARY_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="salaryDescription">
            급여 조건 설명
          </label>
          <input
            id="salaryDescription"
            className={styles.input}
            placeholder="예: 면접 후 결정 (회사 내규에 따름)"
            value={form.salaryDescription}
            onChange={(e) => update('salaryDescription', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="preferredCondition">
          우대 조건
        </label>
        <textarea
          id="preferredCondition"
          className={styles.textarea}
          placeholder="해당 직무 수행에 우대되는 기술 스택이나 경험을 입력해주세요"
          value={form.preferredCondition}
          onChange={(e) => update('preferredCondition', e.target.value)}
        />
      </div>

      {/* ── 출퇴근 시간 ── */}
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label}>출퇴근 시간 설정</label>
          <span className={styles.hintChip}>
            기업의 출퇴근 시간과 가장 잘 맞는 인재를 추천합니다.
          </span>
        </div>
        <div className={styles.row2}>
          <input
            className={styles.input}
            type="time"
            value={form.workStart}
            onChange={(e) => update('workStart', e.target.value)}
            placeholder="출근 (HH:mm)"
          />
          <input
            className={styles.input}
            type="time"
            value={form.workEnd}
            onChange={(e) => update('workEnd', e.target.value)}
            placeholder="퇴근 (HH:mm)"
          />
        </div>
      </div>

      {/* ── 지원 링크 ── */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="applicationUrl">
          지원 링크 바로가기 URL
        </label>
        <input
          id="applicationUrl"
          className={styles.input}
          placeholder="https://careers.company.com/jobs/123"
          value={form.applicationUrl}
          onChange={(e) => update('applicationUrl', e.target.value)}
        />
      </div>

      {/* ── 기술 스택 ── */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="skills">
          요구 기술 스택
        </label>
        <input
          id="skills"
          className={styles.input}
          placeholder="예: React, TypeScript, Node.js (콤마로 구분)"
          value={form.skills}
          onChange={(e) => update('skills', e.target.value)}
        />
      </div>

      {/* ── AI 정량 평가 ── */}
      <div className={styles.field}>
        <label className={styles.label}>AI 정량 평가 항목</label>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.aiEvalCredential}
              onChange={(e) => update('aiEvalCredential', e.target.checked)}
            />
            자격증 / 어학
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.aiEvalExperience}
              onChange={(e) => update('aiEvalExperience', e.target.checked)}
            />
            대외 / 해외 경험
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.aiEvalAward}
              onChange={(e) => update('aiEvalAward', e.target.checked)}
            />
            수상 내역
          </label>
        </div>
      </div>

      {/* ── 제출 버튼 ── */}
      <button
        type="submit"
        className={styles.input}
        disabled={submitting}
        style={{
          background: '#0b63ff',
          color: '#fff',
          fontWeight: 900,
          border: 0,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.6 : 1,
          height: 50,
          borderRadius: 18,
          fontSize: 15,
          letterSpacing: '-0.02em',
          boxShadow: '0 18px 40px rgba(11, 99, 255, 0.24)',
        }}
      >
        {submitting
          ? '처리 중…'
          : isEdit
            ? '채용 공고 수정하기'
            : '채용 공고 게시하기'}
      </button>
    </form>
  )
}

// ── 아이콘 ──

function PinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
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
