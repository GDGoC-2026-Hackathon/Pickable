'use client'

import { useRef, useState, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { openDaumPostcode } from '@/lib/daum-postcode'

import { useCompanyDraft } from '@/components/company/CompanyDraftContext'

import styles from './CompanyInfoCard.module.css'

const COMPANY_SIZE_OPTIONS = [
  { value: 'STARTUP', label: '스타트업 (10인 미만)' },
  { value: 'SMALL', label: '소규모 (10~50인)' },
  { value: 'MEDIUM', label: '중규모 (50~100인)' },
  { value: 'LARGE', label: '대규모 (100~300인)' },
  { value: 'ENTERPRISE', label: '대기업 (300인 이상)' },
] as const

type Variant = 'register' | 'edit'

export function CompanyInfoCard({ variant = 'edit' }: { variant?: Variant }) {
  const router = useRouter()
  const addressInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDraft } = useCompanyDraft()

  const isRegister = variant === 'register'

  const handleAddressSearch = useCallback(() => {
    openDaumPostcode((address) => {
      if (addressInputRef.current) {
        addressInputRef.current.value = address
      }
    }).catch(() => {
      setError('주소 검색 서비스를 불러올 수 없습니다.')
    })
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isRegister) return

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get('name') as string)?.trim()
    const industry = (formData.get('industry') as string)?.trim()
    const address = (formData.get('address') as string)?.trim()
    const companySize = (formData.get('companySize') as string)?.trim()
    const homepageUrl = (formData.get('homepageUrl') as string)?.trim() || undefined
    const description = (formData.get('description') as string)?.trim() || undefined

    if (!name || !industry || !address || !companySize) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/signup/corporation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          industry,
          address,
          companySize,
          homepageUrl: homepageUrl || undefined,
          description: description || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data?.error?.message ?? '등록 중 오류가 발생했습니다.'
        setError(msg)
        return
      }

      router.replace('/dashboard-company')
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.card} aria-label="Company information form">
      <div className={styles.title}>
        {isRegister ? '기업 정보 등록' : '기업 정보 수정'}
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="companyName">
              기업명 <span className={styles.required}>*</span>
            </label>
            <input
              id="companyName"
              name="name"
              className={styles.input}
              placeholder="예: 테크웨이브 (TechWave)"
              required={isRegister}
              disabled={!isRegister}
              onChange={
                isRegister ? (e) => setDraft({ name: e.currentTarget.value }) : undefined
              }
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="industry">
              산업군 <span className={styles.required}>*</span>
            </label>
            <input
              id="industry"
              name="industry"
              className={styles.input}
              placeholder="예: IT · 소프트웨어 개발"
              required={isRegister}
              disabled={!isRegister}
              onChange={
                isRegister
                  ? (e) => setDraft({ industry: e.currentTarget.value })
                  : undefined
              }
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="companySize">
              기업 규모 <span className={styles.required}>*</span>
            </label>
            <select
              id="companySize"
              name="companySize"
              className={styles.select}
              defaultValue=""
              required={isRegister}
              disabled={!isRegister}
            >
              <option value="" disabled hidden>
                기업 규모 선택
              </option>
              {COMPANY_SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="homepage">
              홈페이지 URL
            </label>
            <input
              id="homepage"
              name="homepageUrl"
              type="url"
              className={styles.input}
              placeholder="예: https://techwave.io"
              disabled={!isRegister}
            />
          </div>

          <div className={styles.addressRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="address">
                기업 주소 <span className={styles.required}>*</span>
              </label>
              <input
                ref={addressInputRef}
                id="address"
                name="address"
                className={styles.input}
                placeholder="예: 서울특별시 강남구 테헤란로 123 테크빌딩 15층"
                required={isRegister}
                disabled={!isRegister}
              />
            </div>
            {isRegister && (
              <button
                className={styles.searchButton}
                type="button"
                onClick={handleAddressSearch}
              >
                주소 검색
              </button>
            )}
          </div>

          {isRegister && (
            <div className={styles.fieldFull}>
              <label className={styles.label} htmlFor="description">
                기업 소개
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                rows={3}
                placeholder="기업을 한 문장으로 소개해주세요"
              />
            </div>
          )}
        </div>

        {isRegister ? (
          <div className={styles.buttonRow}>
            <button
              className={styles.saveButton}
              type="submit"
              disabled={loading}
            >
              {loading ? '등록 중...' : '기업 정보 등록'}
            </button>
          </div>
        ) : (
          <div className={styles.buttonRow}>
            <button className={styles.cancelButton} type="button">
              취소
            </button>
            <button
              className={styles.saveButton}
              type="button"
              disabled
              title="수정 기능 준비 중"
            >
              변경사항 저장
            </button>
          </div>
        )}
      </form>
    </section>
  )
}
