// src/app/api/therapists/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'
import { randomBytes } from 'crypto'

/**
 * GET – List all published therapists (public directory)
 */
export async function GET() {
  try {
    const therapists = await prisma.therapist.findMany({
      where: {
        published: true,
        slug: { not: null },
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        primaryCredential: true,
        primaryCity: true,
        primaryState: true,
        // add any other public-facing fields here
      },
    })
    return NextResponse.json(therapists)
  } catch (err: any) {
    console.error('GET /api/therapists error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * POST – Create a new therapist (or return existing) for the signed-in user
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await req.json()
  const { name, ...rest } = payload

  if (!name?.trim()) {
    return NextResponse.json(
      { error: 'Missing required field: name' },
      { status: 400 }
    )
  }

  // Idempotency: if user already has a profile, return it
  const existing = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
  })
  if (existing) {
    return NextResponse.json(existing, { status: 200 })
  }

  // Generate a URL-safe, unique slug from the name
  const baseSlug = slugify(name, { lower: true, strict: true })
  let slug = baseSlug
  for (let i = 0; i < 5; i++) {
    const conflict = await prisma.therapist.findUnique({ where: { slug } })
    if (!conflict) break
    const suffix = randomBytes(2).toString('hex')
    slug = `${baseSlug}-${suffix}`
  }

  try {
    const created = await prisma.therapist.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        ...rest,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/therapists error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
