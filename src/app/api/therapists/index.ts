// src/pages/api/therapists/index.ts
import { getSession } from 'next-auth/react'
import { prisma }     from '@/lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const data = req.body
  if (req.method === 'POST') {
    // create new, tied to this user
    const created = await prisma.therapist.create({
      data: { ...data, userId: session.user.id }
    })
    return res.status(201).json(created)
  }

  if (req.method === 'PUT') {
    if (!data.id) return res.status(400).json({ error: 'Missing id' })
    const updated = await prisma.therapist.update({
      where: { id: data.id },
      data,
    })
    return res.status(200).json(updated)
  }

  res.setHeader('Allow', ['POST','PUT'])
  return res.status(405).end()
}
