import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const therapist = await prisma.therapist.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    return NextResponse.json(therapist)
  } catch (error: any) {
    console.error('GET /api/therapists/[id] error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await req.json()

  const {
    licenseExpirationMonth,
    licenseExpirationYear,
    graduationYear,
    yearsInPractice,
    ...rest
  } = body

  const data = {
    ...rest,
    licenseExpirationMonth: licenseExpirationMonth
      ? parseInt(licenseExpirationMonth, 10)
      : null,
    licenseExpirationYear: licenseExpirationYear
      ? parseInt(licenseExpirationYear, 10)
      : null,
    educationYearGraduated: graduationYear
      ? parseInt(graduationYear, 10)
      : null,
    practiceStartYear: yearsInPractice
      ? parseInt(yearsInPractice, 10)
      : null,
  }

  delete (data as any).id

  try {
    const updated = await prisma.therapist.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('PUT /api/therapists/[id] error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
