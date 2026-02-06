'use client'

import { useEffect, useState } from 'react'

import { CompanyInfoCard } from '@/components/company/CompanyInfoCard'
import { Snackbar } from '@/components/ui/Snackbar'

export default function EditProfileCompanyPage() {
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  useEffect(() => {
    const msg = sessionStorage.getItem('pickable:snackbar')
    if (msg) {
      sessionStorage.removeItem('pickable:snackbar')
      setSnackbarMsg(msg)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/signup/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.data) return
        setHasProfile(json.data.hasProfile === true)
      })
      .catch(() => {
        if (!cancelled) setHasProfile(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (hasProfile === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <>
      <CompanyInfoCard variant={hasProfile ? 'edit' : 'register'} />
      <Snackbar message={snackbarMsg} />
    </>
  )
}
