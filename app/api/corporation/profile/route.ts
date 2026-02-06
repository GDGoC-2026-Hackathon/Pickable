// GET /api/corporation/profile
// 로그인한 기업의 프로필 조회 — 대시보드 사이드바, 기업 정보 수정 폼 등에서 사용

import { requireAuth } from '@/lib/auth-helpers'
import { success, error, parseBody } from '@/lib/api'
import { prisma } from '@/lib/db'
import type { CompanySize } from '@/prisma/generated/prisma/client'

const COMPANY_SIZES: CompanySize[] = ['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']

export type CorporationProfileResponse = {
  id: string
  name: string
  thumbnailUrl: string | null
  industry: string
  companySize: string
  address: string
  homepageUrl: string | null
  description: string | null
  welfare: string | null
  phone: string | null
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
          companySize: true,
          address: true,
          homepageUrl: true,
          description: true,
          welfare: true,
          phone: true,
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
      companySize: corporation!.companySize,
      address: corporation!.address,
      homepageUrl: corporation!.homepageUrl,
      description: corporation!.description,
      welfare: corporation!.welfare,
      phone: corporation!.phone,
    }

    return success(data)
  } catch {
    return error('DB_ERROR')
  }
}

// PATCH /api/corporation/profile — 기업 정보 수정
interface UpdateProfileBody {
  name?: string
  industry?: string
  address?: string
  companySize?: string
  homepageUrl?: string | null
  description?: string | null
  welfare?: string | null
  phone?: string | null
}

export async function PATCH(request: Request) {
  const { session, errorResponse } = await requireAuth()
  if (errorResponse) return errorResponse

  const userId = session!.user.id
  const body = await parseBody<UpdateProfileBody>(request)
  if (!body) return error('INVALID_JSON')

  try {
    const { corporation, err } = await requireCorporation(userId)
    if (err) return err

    const name = body.name?.trim()
    const industry = body.industry?.trim()
    const address = body.address?.trim()
    const companySize = body.companySize?.trim()
    if (name !== undefined && !name) return error('VALIDATION_ERROR', '기업명을 입력해주세요.')
    if (industry !== undefined && !industry) return error('VALIDATION_ERROR', '산업군을 입력해주세요.')
    if (address !== undefined && !address) return error('VALIDATION_ERROR', '주소를 입력해주세요.')
    if (companySize !== undefined && !COMPANY_SIZES.includes(companySize as CompanySize)) {
      return error('VALIDATION_ERROR', '유효한 기업 규모를 선택해주세요.')
    }

    const updateData: {
      name?: string
      industry?: string
      address?: string
      companySize?: CompanySize
      homepageUrl?: string | null
      description?: string | null
      welfare?: string | null
      phone?: string | null
    } = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.industry !== undefined) updateData.industry = body.industry.trim()
    if (body.address !== undefined) updateData.address = body.address.trim()
    if (body.companySize !== undefined) updateData.companySize = body.companySize as CompanySize
    if (body.homepageUrl !== undefined) updateData.homepageUrl = body.homepageUrl?.trim() || null
    if (body.description !== undefined) updateData.description = body.description?.trim() || null
    if (body.welfare !== undefined) updateData.welfare = body.welfare?.trim() || null
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null

    await prisma.corporation.update({
      where: { id: corporation!.id },
      data: updateData,
    })

    return success({ updated: true })
  } catch {
    return error('DB_ERROR')
  }
}
