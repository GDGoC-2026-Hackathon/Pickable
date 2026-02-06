import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pickable',
  description: 'GDGoC 해커톤 프로젝트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
