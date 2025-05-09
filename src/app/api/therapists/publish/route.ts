import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    console.error('❌ No session user ID')
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id, name } = await req.json()
  console.log('📦 Received from frontend:', { id, name })

  if (!id || !name?.trim()) {
    console.error('❌ Missing id or name')
    return NextResponse.json({ success: false, message: 'Missing id or name.' }, { status: 400 })
  }

  const existing = await prisma.therapist.findUnique({ where: { id } })
  console.log('🔍 Fetched therapist:', existing)

  if (!existing || existing.userId !== session.user.id) {
    console.error('❌ Therapist not found or user mismatch')
    return NextResponse.json({ success: false, message: 'Not found or access denied.' }, { status: 404 })
  }

  // Only regenerate slug if none exists
  let slug = existing.slug
  if (!slug) {
    const base = slugify(name, { lower: true, strict: true })
    slug = base
    let suffix = 1

    while (true) {
      const slugExists = await prisma.therapist.findUnique({ where: { slug } })
      if (!slugExists || slugExists.id === id) break
      slug = `${base}-${suffix++}`
    }
  } else {
    console.log('🟡 Skipping slug generation — already has one:', slug)
  }

  try {
    const updated = await prisma.therapist.update({
      where: { id },
      data: {
        published: true,
        slug,
      },
    })

    console.log('✅ Successfully published therapist:', updated)
    return NextResponse.json({ success: true, slug: updated.slug })
  } catch (err: any) {
    console.error('❌ Error updating therapist:', err)
    return NextResponse.json({ success: false, message: 'DB update failed.' }, { status: 500 })
  }
}
