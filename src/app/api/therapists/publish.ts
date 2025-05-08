// src/pages/api/therapists/publish.ts
import { getSession } from 'next-auth/react'
import { prisma }     from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getSession({ req })
  if (!session) return res.status(401).end()

  const { id } = req.body
  if (!id) return res.status(400).json({ success: false, message: 'Missing id' })

  await prisma.therapist.update({
    where: { id },
    data: { published: true },
  })
  return res.status(200).json({ success: true })
}
