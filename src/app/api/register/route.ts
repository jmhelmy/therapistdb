// src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function POST(req: Request) {
  try {
    const { email, password, claimId } = await req.json()

    // 1) Validate
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // 2) Prevent duplicate signup
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 409 }
      )
    }

    // 3) Hash password
    const hashedPassword = await hash(password, 10)

    // 4) Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })

    let therapistId: string

    if (claimId) {
      // 5a) Claim flow: link existing therapist
      const updated = await prisma.therapist.update({
        where: { id: claimId },
        data: { userId: user.id },
      })
      therapistId = updated.id
    } else {
      // 5b) New therapist flow: generate a slug and seed minimal fields
      const base = slugify(email.split('@')[0], { lower: true, strict: true })
      const slug = `${base}-${Date.now()}`

      const therapist = await prisma.therapist.create({
        data: {
          userId: user.id,
          name: 'Unnamed Therapist',
          slug,
          published: false,
          imageUrl: '',
          primaryAddress: '',
          primaryCity: '',
          primaryState: '',
          primaryZip: '',
          feeIndividual: '',
          feeCouples: '',
          slidingScale: false,
          paymentMethods: [],
          insuranceAccepted: '',
          issues: [],
          languages: [],
        },
      })
      therapistId = therapist.id
    }

    // 6) Respond
    return NextResponse.json(
      {
        user: { id: user.id, email: user.email },
        therapistId,
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
