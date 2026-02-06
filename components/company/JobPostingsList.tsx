'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

import type { CorporationJobPostingsResponse } from '@/types/job-posting'

import styles from './JobPostingsList.module.css'

type StatusFilter = 'OPEN' | 'CLOSED' | 'ALL'

export function JobPostingsList() {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: CorporationJobPostingsResponse }
  >({ status: 'loading' })
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('OPEN')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setState({ status: 'loading' })
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(statusFilter !== 'OPEN' && { status: statusFilter }),
    })
    const res = await fetch(`/api/corporation/job-postings?${params}`)
    const json = await res.json()

    if (!res.ok) {
      const message =
        json?.error?.message ?? '채용 공고 목록을 불러오지 못했습니다.'
      setState({ status: 'error', message })
      return
    }

    if (json?.data?.data == null || json?.data?.pagination == null) {
      setState({ status: 'error', message: '응답 형식이 올바르지 않습니다.' })
      return
    }

    setState({
      status: 'success',
      data: {
        data: json.data.data,
        pagination: json.data.pagination,
      },
    })
  }, [page, statusFilter])

  useEffect(() => {
    let cancelled = false

    fetchList().then(() => {
      if (cancelled) return
    })

    return () => {
      cancelled = true
    }
  }, [fetchList])

  // ── 삭제 핸들러 ──
  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`"${title}" 공고를 정말 삭제하시겠습니까?`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/corporation/job-postings/${id}`, {
        method: 'DELETE',
      })
      const json = await res.json()

      if (!res.ok) {
        alert(json?.error?.message ?? '삭제에 실패했습니다.')
        return
      }

      // 삭제 성공 → 목록 새로고침
      await fetchList()
    } catch {
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setDeletingId(null)
    }
  }

  const total =
    state.status === 'success' ? state.data.pagination.total : 0
  const subText =
    statusFilter === 'OPEN'
      ? `현재 활성화된 공고 ${total}개`
      : statusFilter === 'CLOSED'
        ? `마감된 공고 ${total}개`
        : `전체 공고 ${total}개`

  return (
    <section className={styles.sectionCard} aria-label="채용 공고 관리">
      <div className={styles.listHeaderRow}>
        <div>
          <div className={styles.sectionTitle}>채용 공고 관리</div>
          <div className={styles.subText}>{subText}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            aria-label="공고 상태 필터"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter)
              setPage(1)
            }}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 999,
              border: '1px solid rgba(15, 23, 42, 0.12)',
              background: '#fff',
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            <option value="OPEN">활성 공고</option>
            <option value="CLOSED">마감 공고</option>
            <option value="ALL">전체</option>
          </select>
          <Link className={styles.addButton} href="/add-recruitment-company">
            + 공고 추가하기
          </Link>
        </div>
      </div>

      {state.status === 'loading' && (
        <div className={styles.loading}>목록을 불러오는 중…</div>
      )}

      {state.status === 'error' && (
        <div className={styles.error}>{state.message}</div>
      )}

      {state.status === 'success' && state.data.data.length === 0 && (
        <div className={styles.empty}>등록된 채용 공고가 없습니다.</div>
      )}

      {state.status === 'success' && state.data.data.length > 0 && (
        <div className={styles.jobList}>
          {state.data.data.map((item) => (
            <JobRow
              key={item.id}
              item={item}
              onDelete={handleDelete}
              deleting={deletingId === item.id}
            />
          ))}
        </div>
      )}

      {state.status === 'success' &&
        state.data.pagination.totalPages > 1 && (
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              이전
            </button>
            <span>
              {page} / {state.data.pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= state.data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </button>
          </div>
        )}
    </section>
  )
}

function JobRow({
  item,
  onDelete,
  deleting,
}: {
  item: CorporationJobPostingsResponse['data'][number]
  onDelete: (id: string, title: string) => void
  deleting: boolean
}) {
  const { id, title, jobTrack, location, status, daysLeft } = item

  let badge: string | undefined
  let tone: 'danger' | undefined
  if (status === 'CLOSED' || (daysLeft !== null && daysLeft < 0)) {
    badge = '마감'
    tone = 'danger'
  } else if (daysLeft === 0) {
    badge = '오늘마감'
    tone = 'danger'
  } else if (daysLeft !== null && daysLeft > 0) {
    badge = `D-${daysLeft}`
  }

  const badgeClass =
    tone === 'danger'
      ? styles.closed
      : badge?.startsWith('D-')
        ? styles.dDay
        : undefined

  return (
    <div className={styles.jobRow}>
        <div className={styles.jobLeft}>
        <div className={styles.jobLogoWrap}>
          <img
            className={styles.jobLogo}
            src="/images/techwave-o.avif"
            alt=""
            aria-hidden
          />
        </div>
        <div className={styles.jobText}>
          <div className={styles.jobTitle}>{title}</div>
          <div className={styles.jobMeta}>
            {location ? (
              <>
                <span className={styles.metaItem}>
                  <span className={styles.pin} aria-hidden>
                    <PinIcon />
                  </span>
                  <span>{location}</span>
                </span>
                <span className={styles.metaDivider} aria-hidden>·</span>
              </>
            ) : null}
            <span className={styles.metaItem}>{jobTrack}</span>
            {badge ? (
              <span className={badgeClass}>{badge}</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className={styles.jobRight}>
        <Link
          className={styles.ghostButton}
          href={`/dashboard-company/job/${id}/edit`}
        >
          수정
        </Link>
        <button
          className={styles.trashButton}
          type="button"
          aria-label="삭제"
          disabled={deleting}
          onClick={() => onDelete(id, title)}
          style={{ opacity: deleting ? 0.4 : 1 }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
