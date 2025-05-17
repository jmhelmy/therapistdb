// src/app/api/notes/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clientNoteSchema } from '@/lib/schemas/ehrSchemas'; // Your Zod schema for client notes
import { z } from 'zod';

// --- POST Handler (Create a new client note) ---
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in.' }, { status: 401 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const requestBody = await req.json();
    // The clientNoteSchema expects clientId, noteType, content, dateOfService
    const validationResult = clientNoteSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    const { clientId, ...noteData } = validationResult.data;

    // Verify the client exists and belongs to this therapist
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Client not found or you do not have permission to add notes for this client.' }, { status: 403 });
    }

    // isLocked and lockedAt would typically be handled by a separate "lock note" action if implemented.
    // For creation, isLocked defaults to false from the schema.
    const newNote = await prisma.clientNote.create({
      data: {
        ...noteData, // Contains noteType, content, dateOfService, (optional) isLocked
        therapistId: therapist.id,
        clientId: clientId,
      },
      include: { // Optionally include client for context in response
        client: {
            select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(newNote, { status: 201 });

  } catch (error: any) {
    console.error("Error creating client note:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while creating the client note." }, { status: 500 });
  }
}


// --- GET Handler (List notes for a specific client) ---
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to view notes.' }, { status: 401 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const { searchParams } = req.nextUrl;
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'clientId query parameter is required.' }, { status: 400 });
    }
    // Optional: Validate clientId format (e.g., CUID)
    try {
        z.string().cuid().parse(clientId);
    } catch(e) {
        return NextResponse.json({ error: 'Invalid clientId format.' }, { status: 400 });
    }


    // Verify the client exists and belongs to this therapist before fetching notes
    const client = await prisma.client.findUnique({
        where: { id: clientId }
    });

    if (!client || client.therapistId !== therapist.id) {
        return NextResponse.json({ error: 'Client not found or you do not have permission to view notes for this client.' }, { status: 403 });
    }

    // Fetch all notes for this specific client belonging to the therapist
    const notes = await prisma.clientNote.findMany({
      where: {
        clientId: clientId,
        therapistId: therapist.id, // Ensures only notes written by this therapist for this client
      },
      orderBy: [
        { dateOfService: 'desc' }, // Show most recent service date first
        { createdAt: 'desc' },     // Then by creation date
      ],
      // include: { // Optionally include therapist or client details if needed for the list view
      //   client: { select: { firstName: true, lastName: true }}
      // }
    });

    return NextResponse.json(notes, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching client notes:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching client notes." }, { status: 500 });
  }
}