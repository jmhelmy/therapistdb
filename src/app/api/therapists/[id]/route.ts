import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: any
) {
  const id = context.params?.id

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const therapist = await prisma.therapist.findUnique({
    where: { id },
    select: { name: true },
  })

  return NextResponse.json(therapist ?? {})
}
