// src/app/api/therapists/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* -------------------------------------------------------------------------- */
/* GET – return only published therapists with a valid (non‑null, non‑empty) slug */
/* -------------------------------------------------------------------------- */
export async function GET() {
  console.log('🔍 GET /api/therapists called');
  try {
    const therapists = await prisma.therapist.findMany({
      where: {
        published: true,
        slug: { not: '' },   // ← this is all you need
      },
    });

    return NextResponse.json(therapists);
  } catch (error: any) {
    console.error('🔥 ERROR in /api/therapists GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
/* -------------------------------------------------------------------------- */
/* PUT – update a therapist profile (claim/edit)                              */
/* -------------------------------------------------------------------------- */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log('🛠️  Updating therapist:', body.id);

    const updatedTherapist = await prisma.therapist.update({
      where: { id: body.id },
      data: {
        name:               body.name,
        imageUrl:           body.imageUrl,
        city:               body.city,
        state:              body.state,
        licenseStatus:      body.licenseStatus,
        licenseNumber:      body.licenseNumber,
        licenseState:       body.licenseState,
        licenseExpiration:  body.licenseExpiration ? new Date(body.licenseExpiration) : undefined,
        primaryCredential:  body.primaryCredential,
        description:        body.description,
        billing:            body.billing,
        fees:               body.fees,
        paymentMethods:     body.paymentMethods,
        insurance:          body.insurance,
        npi:                body.npi,
        languages:          body.languages,
        clientConcerns:     body.clientConcerns,
        typesOfTherapy:     body.typesOfTherapy,
        services:           body.services,
        ages:               body.ages,
        communities:        body.communities,
        groups:             body.groups,
        primaryOffice:      body.primaryOffice,
      },
    });

    return NextResponse.json({ success: true, therapist: updatedTherapist });
  } catch (error: any) {
    console.error('🔥  ERROR in /api/therapists PUT:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
