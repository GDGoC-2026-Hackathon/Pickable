/* eslint-disable react/jsx-no-useless-fragment */
'use client'

import { useEffect, useMemo, useState } from 'react'

import styles from './Snackbar.module.css'

export function Snackbar({
  message,
  durationMs = 2600,
}: {
  message: string | null
  durationMs?: number
}) {
  const [open, setOpen] = useState(false)

  const normalized = useMemo(() => message?.trim() || null, [message])

  useEffect(() => {
    if (!normalized) return
    setOpen(true)

    const t = window.setTimeout(() => setOpen(false), durationMs)
    return () => window.clearTimeout(t)
  }, [normalized, durationMs])

  if (!normalized) return null

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`} role="status">
      {normalized}
    </div>
  )
}

