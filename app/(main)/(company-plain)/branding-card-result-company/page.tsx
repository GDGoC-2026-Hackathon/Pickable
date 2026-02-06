/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import RecruitmentCard from '@/components/layout/RecruitmentCard'

import styles from './branding-card-result-company.module.css'

// ── 배경 스타일 → 그라데이션 색상 매핑 ──

const BG_COLORS: Record<string, [string, string]> = {
  navy: ['0b63ff', '0b1220'],
  green: ['1fbf7a', '0b1220'],
  purple: ['7c3aed', '111827'],
  black: ['333333', '0b1220'],
}

// ── 카드 데이터 타입 ──

interface BrandingCardData {
  id: string
  catchphrase: string
  description: string
  keywords: string[]
  backgroundStyle: string
  brandingTip?: string | null
  status: string
  prompt?: string | null
}

export default function BrandingCardResultCompanyPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // ── 카드 데이터 state ──
  const [card, setCard] = useState<BrandingCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regeneratingField, setRegeneratingField] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<string | null>(null)

  // ── 편집 state ──
  const [catchphrase, setCatchphrase] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  // ── 스낵바 표시 ──
  const showSnackbar = useCallback((msg: string) => {
    setSnackbar(null)
    requestAnimationFrame(() => setSnackbar(msg))
  }, [])

  // ── 카드 데이터 → 편집 state 동기화 ──
  const syncFormFromCard = useCallback((data: BrandingCardData) => {
    setCatchphrase(data.catchphrase)
    setDescription(data.description)
    setKeywords(data.keywords.map((k) => k.replace(/^#/, '')))
    setPrompt(data.prompt ?? '')
  }, [])

  // ── 초기 로드: GET /api/corporation/branding-card ──
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/corporation/branding-card')
        if (!res.ok) {
          // 카드가 없으면 온보딩으로 돌려보냄
          router.replace('/dashboard-company')
          return
        }
        const json = await res.json()
        const data = json.data as BrandingCardData
        if (!cancelled) {
          setCard(data)
          syncFormFromCard(data)
        }
      } catch {
        if (!cancelled) showSnackbar('카드를 불러오는 데 실패했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [router, syncFormFromCard, showSnackbar])

  // ── AI 다시 생성하기 ──
  const handleRegenerate = useCallback(async () => {
    setRegenerating(true)
    try {
      const res = await fetch('/api/corporation/branding-card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt || undefined }),
      })
      const json = await res.json()
      if (!res.ok) {
        showSnackbar(json?.error?.message ?? 'AI 재생성에 실패했습니다.')
        return
      }
      const data = json.data as BrandingCardData
      setCard(data)
      syncFormFromCard(data)
      showSnackbar('AI 브랜딩 카드가 새로 생성되었습니다.')
    } catch {
      showSnackbar('네트워크 오류가 발생했습니다.')
    } finally {
      setRegenerating(false)
    }
  }, [prompt, syncFormFromCard, showSnackbar])

  // ── 최종 저장 및 공개 ──
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/corporation/branding-card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catchphrase,
          description,
          keywords: keywords.map((k) => k.replace(/^#/, '')),
          status: 'PUBLISHED',
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        showSnackbar(json?.error?.message ?? '저장에 실패했습니다.')
        return
      }
      const data = json.data as BrandingCardData
      setCard(data)
      showSnackbar('브랜딩 카드가 저장 및 공개되었습니다!')
      router.push('/dashboard-company')
    } catch {
      showSnackbar('네트워크 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }, [catchphrase, description, keywords, showSnackbar, router])

  // ── 개별 필드 AI 재생성 ──
  const handleRegenerateField = useCallback(
    async (field: 'catchphrase' | 'description' | 'keywords') => {
      setRegeneratingField(field)
      try {
        const res = await fetch(
          '/api/corporation/branding-card/regenerate-field',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field }),
          },
        )
        const json = await res.json()
        if (!res.ok) {
          showSnackbar(json?.error?.message ?? '재생성에 실패했습니다.')
          return
        }
        const { value } = json.data as { field: string; value: string | string[] }
        if (field === 'catchphrase') setCatchphrase(value as string)
        else if (field === 'description') setDescription(value as string)
        else if (field === 'keywords') {
          const kws = (value as string[]).map((k) => k.replace(/^#/, ''))
          setKeywords(kws)
        }
        showSnackbar(`${field === 'catchphrase' ? '슬로건' : field === 'description' ? '소개 문구' : '키워드'}가 AI로 재생성되었습니다.`)
      } catch {
        showSnackbar('네트워크 오류가 발생했습니다.')
      } finally {
        setRegeneratingField(null)
      }
    },
    [showSnackbar],
  )

  // ── 키워드 삭제 ──
  const removeKeyword = useCallback((idx: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  // ── 키워드 추가 ──
  const addKeyword = useCallback(() => {
    const trimmed = newKeyword.trim().replace(/^#/, '')
    if (!trimmed) return
    if (keywords.length >= 5) {
      showSnackbar('키워드는 최대 5개까지 추가할 수 있습니다.')
      return
    }
    setKeywords((prev) => [...prev, trimmed])
    setNewKeyword('')
  }, [newKeyword, keywords.length, showSnackbar])

  // ── 미리보기용 계산 ──
  const companyName =
    session?.corporation?.name ?? '기업명'
  const bgColors = BG_COLORS[card?.backgroundStyle ?? 'navy'] ?? BG_COLORS.navy
  const previewTags = keywords.map((k) => `#${k}`)

  // ── 팁 ──
  const tips = useMemo(
    () => [
      '회사 소개에는 "우리가 무엇을 하는가"보다 "왜 하는가"를 먼저 강조해보세요.',
      '추상적인 표현보다 실제 사례를 포함하면 신뢰도가 크게 올라갑니다.',
      '지원자가 얻게 될 경험을 구체적으로 작성하면 지원 전환율이 높아집니다.',
      '기업의 문화는 "형용사"보다 "행동 방식"으로 설명하는 것이 효과적입니다.',
    ],
    [],
  )
  const [tipIndex, setTipIndex] = useState(0)

  const handleRandomTip = useCallback(() => {
    setTipIndex((prev) => {
      if (tips.length <= 1) return prev
      let next = prev
      while (next === prev) next = Math.floor(Math.random() * tips.length)
      return next
    })
  }, [tips])

  // ── 로딩 상태 ──
  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingText}>브랜딩 카드를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (!card) return null

  return (
    <div className={styles.wrap}>
      <header className={styles.topRow}>
        <div className={styles.hero}>
          <div className={styles.kicker}>AI BRANDING STUDIO</div>
          <h1 className={styles.title}>
            우리 기업만의 <span className={styles.accent}>AI 브랜딩 카드</span>를
            완성하세요
          </h1>
          <p className={styles.subTitle}>
            AI가 분석한 기업 정보를 바탕으로 생성된 카드입니다.
            <br />
            이 카드가 우리 기업을 더 잘 표현할 수 있도록 문구를 자유롭게
            수정해보세요.
          </p>
        </div>

        <div className={styles.actions} aria-label="Actions">
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            {regenerating ? 'AI 생성 중...' : 'AI 다시 생성하기'}
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '저장 중...' : '최종 저장 및 공개'}
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.leftCol} aria-label="Preview">
          <div className={styles.previewCardWrap}>
            <div className={styles.previewScaled}>
              <RecruitmentCard
                variant="preview"
                companyName={companyName}
                companyDesc={catchphrase || '슬로건을 입력해보세요'}
                matchRate={98}
                tags={previewTags.length > 0 ? previewTags : ['#키워드']}
                image={gradient(bgColors[0], bgColors[1])}
              />
            </div>
          </div>

          <div className={styles.previewHeader}>
            <div className={styles.previewTitleRow}>
              <span className={styles.previewDot} aria-hidden />
              <div className={styles.previewTitle}>실시간 미리보기</div>
              <div className={styles.previewHint}>구직자에게 보여지는 화면입니다</div>
            </div>
          </div>
        </section>

        <section className={styles.rightCol} aria-label="Editor">
          <div className={styles.editorCard}>
            <div className={styles.notice}>
              <div className={styles.noticeIcon} aria-hidden>
                i
              </div>
              <div className={styles.noticeText}>
                <div className={styles.noticeTitle}>기업 브랜딩 문구 편집</div>
                <div className={styles.noticeBody}>
                  이 카드가 우리 기업을 가장 잘 브랜딩 할 수 있도록 문구를
                  수정해보세요.
                  <br />
                  매력적인 문구는 지원율을 평균 45% 향상시킵니다.
                </div>
              </div>
            </div>

            <div className={styles.form}>
              {/* ── 캐치프레이즈 ── */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>
                    메인 슬로건 (Catchphrase){' '}
                    <span className={styles.aiChip}>AI 추천</span>
                  </div>
                  <div className={styles.counter}>
                    {catchphrase.length} / 40자
                  </div>
                </div>
                <div className={styles.inputRow}>
                  <input
                    className={styles.input}
                    placeholder="예: 기술로 세상을 더 심플하게 만드는 사람들"
                    value={catchphrase}
                    onChange={(e) =>
                      setCatchphrase(e.currentTarget.value.slice(0, 40))
                    }
                  />
                  <button
                    className={styles.refreshButton}
                    type="button"
                    onClick={() => handleRegenerateField('catchphrase')}
                    disabled={regeneratingField === 'catchphrase'}
                    aria-label="AI 재추천"
                    title="AI 재추천"
                  >
                    {regeneratingField === 'catchphrase' ? '…' : '↻'}
                  </button>
                </div>
              </div>

              {/* ── 기업 소개 ── */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>
                    기업 한 줄 소개 (Description)
                  </div>
                  <div className={styles.counter}>
                    {description.length} / 100자
                  </div>
                </div>
                <div className={styles.inputRow}>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    placeholder="자유로운 소통과 성장이 공존하는 우리 기업을 소개해보세요."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.currentTarget.value.slice(0, 100))
                    }
                  />
                  <button
                    className={styles.refreshButton}
                    type="button"
                    onClick={() => handleRegenerateField('description')}
                    disabled={regeneratingField === 'description'}
                    aria-label="소개 AI 재추천"
                    title="소개 AI 재추천"
                  >
                    {regeneratingField === 'description' ? '…' : '↻'}
                  </button>
                </div>
              </div>

              {/* ── 키워드 ── */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>
                    핵심 키워드 해시태그 (Keywords)
                  </div>
                  <button
                    className={styles.refreshButtonSmall}
                    type="button"
                    onClick={() => handleRegenerateField('keywords')}
                    disabled={regeneratingField === 'keywords'}
                    title="키워드 AI 재추천"
                  >
                    {regeneratingField === 'keywords'
                      ? '재생성 중...'
                      : '↻ AI 재추천'}
                  </button>
                </div>
                <div className={styles.chips}>
                  {keywords.map((k, i) => (
                    <span key={`${k}-${i}`} className={styles.chip}>
                      #{k}{' '}
                      <button
                        className={styles.chipX}
                        type="button"
                        onClick={() => removeKeyword(i)}
                        aria-label={`${k} 삭제`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {keywords.length < 5 && (
                    <span className={styles.chipAddWrap}>
                      <input
                        className={styles.chipInput}
                        placeholder="키워드 입력"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.currentTarget.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addKeyword()
                          }
                        }}
                      />
                      <button
                        className={styles.chipAdd}
                        type="button"
                        onClick={addKeyword}
                      >
                        + 추가
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* ── 프롬프트 ── */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <div className={styles.label}>
                    AI 브랜딩 카드 재생성 프롬프트 (Prompt)
                  </div>
                  <div className={styles.counter}>
                    {prompt.length} / 200자
                  </div>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="AI가 더 좋은 브랜딩 문구를 만들 수 있도록 프롬프트를 수정해보세요."
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.currentTarget.value.slice(0, 200))
                  }
                />
              </div>
            </div>
          </div>

          <div className={styles.tipCard} aria-label="Branding tip">
            <div className={styles.tipLeft}>
              <span className={styles.tipIcon} aria-hidden>
                💡
              </span>
              <div>
                <div className={styles.tipTitle}>브랜딩 팁</div>
                <div className={styles.tipBody}>
                  {card.brandingTip || tips[tipIndex]}
                </div>
              </div>
            </div>
            <button
              className={styles.tipButton}
              type="button"
              onClick={handleRandomTip}
            >
              다른 예시 보기
            </button>
          </div>
        </section>
      </div>

      {/* 스낵바 */}
      {snackbar && <SnackbarInline message={snackbar} />}
    </div>
  )
}

// ── 인라인 스낵바 (간단한 알림) ──

function SnackbarInline({ message }: { message: string }) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!open) return null

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#0b1220',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 14,
        fontWeight: 900,
        fontSize: 13,
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        letterSpacing: '-0.02em',
      }}
    >
      {message}
    </div>
  )
}

function gradient(colorA: string, colorB: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <radialGradient id="g1" cx="20%" cy="20%" r="90%">
        <stop offset="0%" stop-color="#${colorA}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="#${colorA}" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#${colorB}" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#${colorB}"/>
        <stop offset="100%" stop-color="#${colorB}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g2)"/>
    <rect width="1200" height="800" fill="url(#g1)"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
