'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import RecruitmentCard from '@/components/layout/RecruitmentCard'
import { SALARY_RANGE_OPTIONS } from '@/lib/constants/job-posting-options'
import type { JobPostingListItem } from '@/types/job-posting'
import './MainPageEmployee.css'

const DEFAULT_LIMIT = 12

function formatDeadline(iso: string | null): string {
  if (!iso) return '상시'
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return '상시'
  }
}

function formatSalary(
  salaryRange: JobPostingListItem['salaryRange'],
  salaryDescription: string | null
): string {
  if (salaryDescription?.trim()) return salaryDescription.trim()
  if (!salaryRange) return '면접 후 결정'
  const opt = SALARY_RANGE_OPTIONS.find((o) => o.value === salaryRange)
  return opt?.label ?? '면접 후 결정'
}

function formatWorkTime(workStart: string | null, workEnd: string | null): string {
  if (workStart && workEnd) return `${workStart} ~ ${workEnd}`
  if (workStart) return `${workStart} ~`
  if (workEnd) return `~ ${workEnd}`
  return '-'
}

function mapItemToCardProps(item: JobPostingListItem) {
  return {
    companyName: item.corporation.name,
    companyDesc: item.corporation.description?.trim() || undefined,
    matchRate: item.matchRate ?? undefined,
    hiringLabel: item.status === 'OPEN' ? '채용 중' : '마감',
    tags: item.corporation.tags ?? [],
    positionTitle: item.title,
    deadline: formatDeadline(item.deadline),
    experience: item.preferredCondition?.trim() || '-',
    location: item.location?.trim() || '-',
    salary: formatSalary(item.salaryRange, item.salaryDescription),
    workTime: formatWorkTime(item.workStart, item.workEnd),
    liked: false,
    applicationUrl: item.applicationUrl ?? null,
  }
}

export default function MainPageEmployee() {
  const { data: session } = useSession()
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | {
        status: 'success'
        data: JobPostingListItem[]
        pagination: { page: number; totalPages: number; total: number }
        loadingMore?: boolean
      }
  >({ status: 'loading' })

  const fetchList = useCallback(
    async (
      pageNum: number,
      append: boolean,
      previousData?: JobPostingListItem[],
      signal?: AbortSignal
    ) => {
      try {
        if (!append) setState({ status: 'loading' })
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(DEFAULT_LIMIT),
          status: 'OPEN',
        })
        const res = await fetch(`/api/job-postings?${params}`, { signal })
        const json = await res.json()

        if (signal?.aborted) return
        if (!res.ok) {
          setState({
            status: 'error',
            message: json?.error?.message ?? '공고 목록을 불러오지 못했습니다.',
          })
          return
        }

        const list = json?.data ?? []
        const pagination = json?.pagination ?? {
          page: pageNum,
          totalPages: 1,
          total: list.length,
        }

        setState({
          status: 'success',
          data:
            append && previousData && previousData.length >= 0
              ? [...previousData, ...list]
              : list,
          pagination: {
            page: pagination.page,
            totalPages: pagination.totalPages ?? 1,
            total: pagination.total ?? list.length,
          },
          loadingMore: false,
        })
      } catch (err) {
        const isAbort =
          (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError') ||
          (err instanceof Error && err.name === 'AbortError')
        if (isAbort) return
        throw err
      }
    },
    []
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchList(1, false, undefined, controller.signal)
    return () => controller.abort()
  }, [fetchList])

  const loadMore = useCallback(() => {
    if (state.status !== 'success') return
    const { page: currentPage, totalPages } = state.pagination
    const nextPage = currentPage + 1
    if (nextPage > totalPages) return
    setState((prev) =>
      prev.status === 'success' ? { ...prev, loadingMore: true } : prev
    )
    fetchList(nextPage, true, state.data)
  }, [
    state.status,
    state.status === 'success' ? state.pagination : undefined,
    state.status === 'success' ? state.data : undefined,
    fetchList,
  ])

  const userName = session?.user?.name || session?.user?.email || null
  const subtitle = userName
    ? `AI가 분석한 ${userName} 님의 커리어 패스에 맞는 모든 기업을 카드 형식으로 만나보세요.`
    : '맞춤형 채용 공고를 카드 형식으로 만나보세요.'

  if (state.status === 'error') {
    return (
      <div className="mpe-page">
        <main className="mpe-main">
          <div className="mpe-container">
            <div className="mpe-head">
              <h1 className="mpe-title">맞춤형 기업 공고 전체보기</h1>
              <p className="mpe-subtitle">{subtitle}</p>
            </div>
            <div className="mpe-error" role="alert">
              {state.message}
            </div>
            <button
              type="button"
              className="mpe-retry"
              onClick={() => fetchList(1, false, undefined)}
            >
              다시 불러오기
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (state.status === 'loading') {
    return (
      <div className="mpe-page">
        <main className="mpe-main">
          <div className="mpe-container">
            <div className="mpe-head">
              <h1 className="mpe-title">맞춤형 기업 공고 전체보기</h1>
              <p className="mpe-subtitle">{subtitle}</p>
            </div>
            <div className="mpe-loading">공고를 불러오는 중...</div>
          </div>
        </main>
      </div>
    )
  }

  const items = state.data
  const pagination = state.pagination
  const loadingMore = state.loadingMore === true
  const hasMore =
    pagination.page < pagination.totalPages && !loadingMore

  return (
    <div className="mpe-page">
      <main className="mpe-main">
        <div className="mpe-container">
          <div className="mpe-head">
            <div>
              <h1 className="mpe-title">맞춤형 기업 공고 전체보기</h1>
              <p className="mpe-subtitle">{subtitle}</p>
            </div>
            <div className="mpe-actions">
              <button className="mpe-action-btn" type="button" disabled title="준비 중">
                <span className="mpe-action-ico" aria-hidden>⎇</span>
                필터
              </button>
              <button className="mpe-action-btn" type="button" disabled title="준비 중">
                <span className="mpe-action-ico" aria-hidden>⇅</span>
                정렬
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mpe-empty">현재 채용 중인 공고가 없습니다.</div>
          ) : (
            <>
              <section className="mpe-grid">
                {items.map((it) => (
                  <RecruitmentCard key={it.id} {...mapItemToCardProps(it)} />
                ))}
              </section>
              {hasMore && (
                <div className="mpe-more">
                  <button
                    type="button"
                    className="mpe-more-btn"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? '불러오는 중...' : '더보기'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
