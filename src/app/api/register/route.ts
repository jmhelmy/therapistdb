// src/app/api/register/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password, claimId } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // make sure there's no existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 409 }
      )
    }

    // hash the password
    const hashedPassword = await hash(password, 10)

    // 1) create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    let therapistId: string

    if (claimId) {
      // 2a) CLAIM FLOW: link the new user to the existing therapist
      const updated = await prisma.therapist.update({
        where: { id: claimId },
        data: { userId: user.id },
      })
      therapistId = updated.id
    } else {
      // 2b) REGULAR REGISTER: create a new Therapist
      const therapist = await prisma.therapist.create({
        data: {
          userId: user.id,
          name: 'Unnamed Therapist',
          slug: `therapist-${Date.now()}`,
          published: false,
          profileComplete: false,
        },
      })
      therapistId = therapist.id
    }

    // 3) respond with user + therapistId
    return NextResponse.json(
      {
        message: 'Success',
        user: { id: user.id, email: user.email, therapistId },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
