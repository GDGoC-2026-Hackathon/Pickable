// GET /api/corporation/profile
// 로그인한 기업의 프로필(이미지, 이름, 산업) 조회 — 대시보드 사이드바 등에서 사용

import { requireAuth } from '@/lib/auth-helpers'
import { success, error } from '@/lib/api'
import { prisma } from '@/lib/db'

export type CorporationProfileResponse = {
  id: string
  name: string
  thumbnailUrl: string | null
  industry: string
}

async function requireCorporation(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      corporation: {
        select: {
          id: true,
          name: true,
          thumbnailUrl: true,
          industry: true,
        },
      },
    },
  })

  if (!user) return { corporation: null, err: error('USER_NOT_FOUND') }
  if (!user.role) return { corporation: null, err: error('ROLE_NOT_SET') }
  if (user.role !== 'CORPORATION')
    return { corporation: null, err: error('ROLE_MISMATCH') }
  if (!user.corporation)
    return { corporation: null, err: error('CORPORATION_NOT_FOUND') }

  return { corporation: user.corporation, err: null }
}

export async function GET() {
  const { session, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const userId = session!.user.id

  try {
    const { corporation, err } = await requireCorporation(userId)
    if (err) return err

    const data: CorporationProfileResponse = {
      id: corporation!.id,
      name: corporation!.name,
      thumbnailUrl: corporation!.thumbnailUrl,
      industry: corporation!.industry,
    }

    return success(data)
  } catch {
    return error('DB_ERROR')
  }
}
