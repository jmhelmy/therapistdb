// src/app/api/therapists/publish/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // 1) Auth
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  // 2) Parse body
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Missing id' },
      { status: 400 }
    )
  }

  // 3) Ownership check
  const existing = await prisma.therapist.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json(
      { success: false, message: 'Not found or access denied' },
      { status: 404 }
    )
  }

  // 4) Publish
  try {
    await prisma.therapist.update({
      where: { id },
      data: { published: true },
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('POST /api/therapists/publish error', err)
    return NextResponse.json(
      { success: false, message: 'DB update failed' },
      { status: 500 }
    )
  }
}
