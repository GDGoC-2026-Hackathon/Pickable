'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const VALID_ROLES = ['JOB_SEEKER', 'CORPORATION'] as const
type Role = (typeof VALID_ROLES)[number]

function getRedirectUrl(role: Role, hasProfile: boolean): string {
  if (role === 'CORPORATION') {
    return hasProfile ? '/dashboard-company' : '/edit-profile-company'
  }
  // JOB_SEEKER: 첫 로그인(프로필 없음) → 정보 등록, 프로필 있음 → 마이페이지
  return hasProfile ? '/my-page-employee' : '/edit-profile-employee'
}

function OnboardingCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const roleParam = searchParams.get('role')
    const role = VALID_ROLES.includes(roleParam as Role) ? (roleParam as Role) : null

    if (!role) {
      router.replace('/')
      return
    }

    async function setRoleAndRedirect() {
      try {
        const res = await fetch('/api/signup/role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        })

        const data = await res.json()
        const errorCode = data?.error?.code

        if (!res.ok && errorCode === 'ROLE_ALREADY_SET') {
          // 이미 역할이 설정된 경우 - 상태 조회 후 적절한 페이지로 리다이렉트
        } else if (!res.ok) {
          setStatus('error')
          return
        }

        const statusRes = await fetch('/api/signup/status')
        const statusData = await statusRes.json()

        if (!statusRes.ok) {
          router.replace('/')
          return
        }

        const { role: userRole, hasProfile } = statusData?.data ?? {}
        const url = userRole ? getRedirectUrl(userRole as Role, !!hasProfile) : '/'
        router.replace(url)
      } catch {
        setStatus('error')
      }
    }

    setRoleAndRedirect()
  }, [router, searchParams])

  if (status === 'error') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">역할 설정 중 오류가 발생했습니다.</p>
          <button
            type="button"
            onClick={() => router.replace('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-gray-500">로그인 처리 중...</p>
    </div>
  )
}

export default function OnboardingCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-gray-500">로그인 처리 중...</p>
        </div>
      }
    >
      <OnboardingCompleteContent />
    </Suspense>
  )
}
