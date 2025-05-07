import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* GET  /api/therapists/:id   → { name: "Tom Zhang" }  */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const therapist = await prisma.therapist.findUnique({
    where: { id: params.id },
    select: { name: true },
  });

  // return {} if not found so the fetch still resolves
  return NextResponse.json(therapist ?? {});
}
