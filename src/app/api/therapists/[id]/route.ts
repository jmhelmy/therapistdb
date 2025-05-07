import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const therapist = await prisma.therapist.findUnique({
    where: { id },
    select: { name: true },
  });

  return NextResponse.json(therapist ?? {});
}
