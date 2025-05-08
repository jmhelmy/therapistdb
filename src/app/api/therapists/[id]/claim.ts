// src/pages/api/therapists/[id]/claim.ts
import { getSession } from 'next-auth/react'
import { prisma }     from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getSession({ req })
  if (!session) return res.status(401).end()

  const { id } = req.query
  if (!id || typeof id !== 'string')
    return res.status(400).json({ error: 'Missing id' })

  const existing = await prisma.therapist.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'Not found' })
  if (existing.userId)
    return res.status(409).json({ error: 'Already claimed' })

  const claimed = await prisma.therapist.update({
    where: { id },
    data:  { userId: session.user.id },
  })
  return res.status(200).json(claimed)
}
