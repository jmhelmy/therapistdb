// src/app/api/therapists/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  if (!data.name) {
    return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
  }

  // 1) Generate base slug from name
  let baseSlug = slugify(data.name, { lower: true, strict: true })
  let slug = baseSlug

  // 2) Ensure uniqueness by checking existing
  let count = 0
  while (
    await prisma.therapist.findUnique({ where: { slug } })
  ) {
    count++
    // append a short random suffix or counter
    const suffix = randomBytes(2).toString('hex')
    slug = `${baseSlug}-${suffix}`
    if (count > 5) break  // safety net
  }

  try {
    const created = await prisma.therapist.create({
      data: {
        ...data,
        userId: session.user.id,
        slug,               // use our generated slug
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error('POST /api/therapists error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
