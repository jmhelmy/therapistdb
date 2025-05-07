import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { id, name } = await req.json()

  if (!id || !name) {
    return new Response(JSON.stringify({ success: false, message: 'Missing id or name' }), {
      status: 400,
    })
  }

  try {
    await prisma.therapist.update({
      where: { id },
      data: { published: true },
    })
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: 'DB update failed' }), {
      status: 500,
    })
  }
}
