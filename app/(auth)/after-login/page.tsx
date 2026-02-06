'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type RoleIntent = 'JOB_SEEKER' | 'CORPORATION'

function destinationForRole(role: RoleIntent | null | undefined) {
  if (role === 'JOB_SEEKER') return '/profile-employee'
  if (role === 'CORPORATION') return '/profile-company'
  return '/'
}

export default function AfterLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = (searchParams.get('intent') ?? null) as RoleIntent | null
  const [message, setMessage] = useState('로그인 처리 중…')

  const retryLoginUrl = useMemo(() => {
    const current = `/after-login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return `/login?callbackUrl=${encodeURIComponent(current)}`
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    async function run() {
      setMessage('가입 상태 확인 중…')

      const statusRes = await fetch('/api/signup/status', { cache: 'no-store' })
      if (cancelled) return

      if (statusRes.status === 401) {
        router.replace(retryLoginUrl)
        return
      }

      const statusJson = (await statusRes.json()) as
        | { data: { role: RoleIntent | null; hasProfile: boolean } }
        | { error: { code: string; message: string } }

      if (!('data' in statusJson)) {
        setMessage(statusJson.error.message ?? '오류가 발생했습니다.')
        return
      }

      if (!statusJson.data.role && intent) {
        setMessage('역할 설정 중…')
        const roleRes = await fetch('/api/signup/role', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ role: intent }),
        })
        if (cancelled) return

        if (!roleRes.ok) {
          const roleJson = (await roleRes.json()) as
            | { data: unknown }
            | { error: { code: string; message: string } }
          if ('error' in roleJson && roleJson.error.code !== 'ROLE_ALREADY_SET') {
            setMessage(roleJson.error.message ?? '역할 설정에 실패했습니다.')
            return
          }
        }
      }

      setMessage('페이지로 이동 중…')
      const finalStatusRes = await fetch('/api/signup/status', { cache: 'no-store' })
      const finalJson = (await finalStatusRes.json()) as
        | { data: { role: RoleIntent | null; hasProfile: boolean } }
        | { error: { code: string; message: string } }

      const role = 'data' in finalJson ? finalJson.data.role : intent
      router.replace(destinationForRole(role))
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [intent, retryLoginUrl, router, searchParams])

  return (
    <main style={{ padding: 24, textAlign: 'center' }}>
      <p>{message}</p>
    </main>
  )
}

