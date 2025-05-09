// src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

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
    const cleanEmail = email.trim().toLowerCase()

    // 2) Prevent duplicates
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 409 }
      )
    }

    // 3) Hash & create user
    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: { email: cleanEmail, password: hashedPassword },
    })

    let therapistId: string

    if (claimId) {
      // 4a) Claim an existing profile
      const updated = await prisma.therapist.update({
        where: { id: claimId },
        data: {
          user: { connect: { id: user.id } },
        },
      })
      therapistId = updated.id
    } else {
      // 4b) Create a blank new profile
      const therapist = await prisma.therapist.create({
        data: {
          user: { connect: { id: user.id } },
          name: null,
          slug: null,
          published: false,
        },
      })
      therapistId = therapist.id
    }

    // 5) Return success
    return NextResponse.json(
      {
        user: { id: user.id, email: user.email },
        therapistId,
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('❌ Registration error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
