import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ THIS WORKS with App Router
export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const id = params.id

  const therapist = await prisma.therapist.findUnique({
    where: { id },
    select: { name: true },
  })

  return NextResponse.json(therapist ?? {})
}
