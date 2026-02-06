'use client'

import { useEffect, useState } from 'react'

import { JobPostingForm } from '@/components/company/JobPostingForm'
import type { JobPostingDetail } from '@/types/job-posting'

type EditJobPostingClientProps = {
  postingId: string
}

export function EditJobPostingClient({ postingId }: EditJobPostingClientProps) {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: JobPostingDetail }
  >({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function fetchPosting() {
      try {
        const res = await fetch(`/api/job-postings/${postingId}`)
        const json = await res.json()

        if (cancelled) return

        if (!res.ok) {
          setState({
            status: 'error',
            message: json?.error?.message ?? '공고를 불러오지 못했습니다.',
          })
          return
        }

        setState({ status: 'success', data: json.data })
      } catch {
        if (!cancelled) {
          setState({
            status: 'error',
            message: '네트워크 오류가 발생했습니다.',
          })
        }
      }
    }

    fetchPosting()
    return () => {
      cancelled = true
    }
  }, [postingId])

  return (
    <div
      style={{
        background: '#f6f8fb',
        padding: '36px 0 72px',
      }}
    >
      <div
        style={{
          width: 'min(860px, calc(100% - 40px))',
          margin: '0 auto',
        }}
      >
        <header style={{ padding: '18px 0 28px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.16em',
              color: 'rgba(11, 99, 255, 0.9)',
            }}
          >
            EDIT POSTING
          </div>
          <h1
            style={{
              marginTop: 10,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#0b1220',
            }}
          >
            채용 공고 수정
          </h1>
          <p
            style={{
              marginTop: 10,
              color: 'rgba(11, 18, 32, 0.62)',
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            공고 내용을 수정한 뒤 저장 버튼을 눌러주세요.
          </p>
        </header>

        <section
          style={{
            borderRadius: 22,
            background: '#ffffff',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: '0 24px 60px rgba(2, 8, 23, 0.06)',
            padding: 22,
          }}
        >
          {state.status === 'loading' && (
            <div
              style={{
                padding: '48px 0',
                textAlign: 'center',
                color: 'rgba(11, 18, 32, 0.5)',
                fontWeight: 800,
              }}
            >
              공고 정보를 불러오는 중…
            </div>
          )}

          {state.status === 'error' && (
            <div
              style={{
                padding: 12,
                borderRadius: 14,
                background: 'rgba(225, 29, 72, 0.08)',
                color: '#be123c',
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {state.message}
            </div>
          )}

          {state.status === 'success' && (
            <JobPostingForm
              mode="edit"
              postingId={postingId}
              initialData={state.data}
            />
          )}
        </section>
      </div>
    </div>
  )
}
