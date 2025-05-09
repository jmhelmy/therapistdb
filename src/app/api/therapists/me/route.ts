import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import slugify from 'slugify'

// GET /api/therapists/me — Load current user's therapist profile
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
  })

  if (!therapist) {
    return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 })
  }

  return NextResponse.json(therapist)
}

// PUT /api/therapists/me — Update current user's therapist profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 })
    }

    // Generate a slug if not already present and name is provided
    let slug = therapist.slug
    if (!slug && data.name) {
      const base = slugify(data.name, { lower: true, strict: true })
      let uniqueSlug = base
      let suffix = 1

      while (await prisma.therapist.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${base}-${suffix++}`
      }

      slug = uniqueSlug
      data.slug = slug
    }

    const updated = await prisma.therapist.update({
      where: { userId: session.user.id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('❌ PUT /api/therapists/me error:', error)
    return NextResponse.json(
      { error: error.message || 'Unexpected server error' },
      { status: 500 }
    )
  }
}
