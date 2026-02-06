'use client'

import { useEffect, useState } from 'react'

import { CompanyInfoCard } from '@/components/company/CompanyInfoCard'
import { Snackbar } from '@/components/ui/Snackbar'

export default function EditProfileCompanyPage() {
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)

  useEffect(() => {
    const msg = sessionStorage.getItem('pickable:snackbar')
    if (!msg) return

    sessionStorage.removeItem('pickable:snackbar')
    setSnackbarMsg(msg)
  }, [])

  return (
    <>
      <CompanyInfoCard variant="register" />
      <Snackbar message={snackbarMsg} />
    </>
  )
}
