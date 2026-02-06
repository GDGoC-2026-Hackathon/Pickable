'use client'

import { useEffect, useMemo, useState } from 'react'

type ChecklistItem = {
  id: string
  text: string
}

type ChecklistSection = {
  dotTone: 'blue' | 'green' | 'orange' | 'red'
  title: string
  items: ChecklistItem[]
}

import styles from './RecruitingChecklist.module.css'

const SECTIONS: ChecklistSection[] = [
  {
    dotTone: 'blue',
    title: '1. 기업 정보 신뢰성',
    items: [
      { id: 'company-vision', text: '회사의 핵심 사업과 비전을 명확히 설명했나요?' },
      { id: 'company-cases', text: '실제 수행하는 프로젝트 또는 서비스 사례를 포함했나요?' },
      { id: 'company-scale', text: '조직 규모, 팀 구조, 성장 단계 등을 구체적으로 작성했나요?' },
    ],
  },
  {
    dotTone: 'green',
    title: '2. 직무 정보 구체성',
    items: [
      { id: 'role-duties', text: '지원자가 수행할 실제 업무 내용을 명확히 작성했나요?' },
      { id: 'role-process', text: '사용 기술, 협업 방식, 업무 프로세스를 구체적으로 설명했나요?' },
      { id: 'role-growth', text: '입사 후 성장 가능 경로를 제시했나요?' },
    ],
  },
  {
    dotTone: 'orange',
    title: '3. 근무 조건 투명성',
    items: [
      { id: 'work-salary', text: '연봉 범위 또는 보상 체계를 명확히 제시했나요?' },
      { id: 'work-policy', text: '근무 형태(재택, 유연근무 등)를 구체적으로 설명했나요?' },
      { id: 'work-welfare', text: '복지 및 지원 제도를 실제 제공 수준으로 작성했나요?' },
    ],
  },
  {
    dotTone: 'red',
    title: '4. 신뢰성 및 정확성 검증',
    items: [
      { id: 'verify-exaggeration', text: '과장된 표현이나 확인되지 않은 정보를 포함하지 않았나요?' },
      { id: 'verify-review', text: '실제 재직자가 검토했나요?' },
      { id: 'verify-clarity', text: '지원자가 오해할 수 있는 모호한 표현을 제거했나요?' },
    ],
  },
]

export function RecruitingChecklist() {
  const allItemIds = useMemo(
    () => SECTIONS.flatMap((section) => section.items.map((item) => item.id)),
    []
  )
  const [storageKey, setStorageKey] = useState<string | null>(null)
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const id of allItemIds) initial[id] = false
    return initial
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' })
      if (cancelled) return
      if (!meRes.ok) return

      const meJson = (await meRes.json()) as { data: { id: string } }
      const key = `pickable:recruitingChecklist:${meJson.data.id}`
      setStorageKey(key)

      const raw = localStorage.getItem(key)
      if (!raw) return

      try {
        const parsed = JSON.parse(raw) as Record<string, boolean>
        setCheckedById((prev) => {
          const next = { ...prev }
          for (const id of allItemIds) {
            next[id] = Boolean(parsed[id])
          }
          return next
        })
      } catch {
        // ignore corrupted localStorage
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [allItemIds])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(checkedById))
  }, [checkedById, storageKey])

  return (
    <section className={styles.root} aria-label="채용 공고 작성 체크리스트">
      <header className={styles.header}>
        <span className={styles.headerIcon} aria-hidden>
          ✓
        </span>
        <h1 className={styles.headerTitle}>기업 공고 작성 체크리스트</h1>
      </header>

      <div className={styles.grid}>
        {SECTIONS.map((section) => (
          <ChecklistCard
            key={section.title}
            section={section}
            checkedById={checkedById}
            onToggle={(id) => {
              setCheckedById((prev) => ({ ...prev, [id]: !prev[id] }))
            }}
          />
        ))}
      </div>
    </section>
  )
}

function ChecklistCard({
  section,
  checkedById,
  onToggle,
}: {
  section: ChecklistSection
  checkedById: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const dotClass =
    section.dotTone === 'blue'
      ? styles.dotBlue
      : section.dotTone === 'green'
        ? styles.dotGreen
        : section.dotTone === 'orange'
          ? styles.dotOrange
          : styles.dotRed

  return (
    <section className={styles.card} aria-label={section.title}>
      <div className={styles.cardTitleRow}>
        <span className={dotClass} aria-hidden />
        <div className={styles.cardTitle}>{section.title}</div>
      </div>

      <div className={styles.items}>
        {section.items.map((item) => (
          <label key={item.text} className={styles.item}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={Boolean(checkedById[item.id])}
              onChange={() => onToggle(item.id)}
            />
            <span className={styles.itemText}>{item.text}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
