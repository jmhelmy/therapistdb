// src/app/api/therapists/me/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
  })

  if (!therapist) {
    return new Response(null, { status: 204 })
  }

  return NextResponse.json(therapist)
}
