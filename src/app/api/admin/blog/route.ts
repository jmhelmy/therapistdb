import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, slug, content } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      published: true,
    },
  })

  return NextResponse.json(post, { status: 200 })
}
