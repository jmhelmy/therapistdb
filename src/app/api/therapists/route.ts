// src/app/api/therapists/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'
import { randomBytes } from 'crypto'

/* GET – list published therapists (for directory) */
export async function GET() {
  try {
    const therapists = await prisma.therapist.findMany({
      where: { published: true, slug: { not: '' } },
    })
    return NextResponse.json(therapists)
  } catch (error: any) {
    console.error('GET /api/therapists error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/* POST – create or return existing therapist tied to the signed-in user */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Strip any client-sent slug and parse payload
  const raw = await req.json()
  const { slug: _omit, ...data } = raw

  // Validate required field
  if (!data.name) {
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

  // Generate a URL-safe slug from name
  const baseSlug = slugify(data.name, { lower: true, strict: true })
  let slug = baseSlug

  // Ensure uniqueness by appending a random suffix if needed
  for (let i = 0; i < 5; i++) {
    const conflict = await prisma.therapist.findUnique({ where: { slug } })
    if (!conflict) break
    const suffix = randomBytes(2).toString('hex')
    slug = `${baseSlug}-${suffix}`
  }

  try {
    const created = await prisma.therapist.create({
      data: {
        ...data,
        userId: session.user.id,
        slug,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/therapists error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/* PUT – update an existing therapist (only owner) */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const raw = await req.json()
  const { slug: _omit, ...data } = raw

  if (!data.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const existing = await prisma.therapist.findUnique({ where: { id: data.id } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or no access' }, { status: 404 })
    }

    const updated = await prisma.therapist.update({
      where: { id: data.id },
      data,
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('PUT /api/therapists error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
