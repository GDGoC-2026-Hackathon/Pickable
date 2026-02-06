'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function CompanyAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function checkAndRedirect() {
      try {
        const res = await fetch('/api/signup/status')
        const data = await res.json()

        if (!res.ok) {
          router.replace('/')
          return
        }

        const { role, hasProfile } = data?.data ?? {}

        if (role !== 'CORPORATION') {
          router.replace('/')
          return
        }

        const isEditProfilePage = pathname?.startsWith('/edit-profile-company')

        if (hasProfile && isEditProfilePage) {
          router.replace('/dashboard-company')
          return
        }

        if (!hasProfile && !isEditProfilePage) {
          router.replace('/edit-profile-company')
          return
        }

        setReady(true)
      } catch {
        router.replace('/')
      }
    }

    checkAndRedirect()
  }, [router, pathname])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return <>{children}</>
}
