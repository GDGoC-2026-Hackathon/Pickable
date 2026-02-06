'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type CompanyDraft = {
  name: string
  industry: string
}

type CompanyDraftContextValue = {
  draft: CompanyDraft
  setDraft: (next: Partial<CompanyDraft>) => void
  resetDraft: () => void
}

const CompanyDraftContext = createContext<CompanyDraftContextValue | null>(null)

const EMPTY_DRAFT: CompanyDraft = { name: '', industry: '' }

export function CompanyDraftProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [draft, setDraftState] = useState<CompanyDraft>(EMPTY_DRAFT)

  const value = useMemo<CompanyDraftContextValue>(() => {
    return {
      draft,
      setDraft: (next) => {
        setDraftState((prev) => ({ ...prev, ...next }))
      },
      resetDraft: () => setDraftState(EMPTY_DRAFT),
    }
  }, [draft])

  return (
    <CompanyDraftContext.Provider value={value}>
      {children}
    </CompanyDraftContext.Provider>
  )
}

export function useCompanyDraft() {
  const ctx = useContext(CompanyDraftContext)
  if (!ctx) {
    throw new Error('useCompanyDraft must be used within CompanyDraftProvider')
  }
  return ctx
}

