// src/app/api/notes/[noteId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clientNoteSchema } from '@/lib/schemas/ehrSchemas'; // For PUT validation
import { z } from 'zod';

interface RouteContext {
  params: {
    noteId?: string;
  };
}

// --- GET Handler (Fetch a specific client note by ID) ---
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { noteId } = context.params;

    if (!noteId || typeof noteId !== 'string') {
      return NextResponse.json({ error: 'Note ID is required and must be a string.' }, { status: 400 });
    }

    // Optional: Validate noteId format (e.g., CUID)
    // try { z.string().cuid().parse(noteId); } catch (e) { return NextResponse.json({ error: 'Invalid Note ID format.' }, { status: 400 }); }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const note = await prisma.clientNote.findUnique({
      where: {
        id: noteId,
      },
      include: { // Optionally include client details if useful when fetching a single note
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    if (!note) {
      return NextResponse.json({ error: 'Client note not found.' }, { status: 404 });
    }

    // Authorization: Ensure the note belongs to the logged-in therapist
    if (note.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to this note.' }, { status: 403 });
    }

    return NextResponse.json(note, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching client note ${context.params.noteId}:`, error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching the note." }, { status: 500 });
  }
}


// --- PUT Handler (Update a specific client note by ID) ---
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { noteId } = context.params;

    if (!noteId || typeof noteId !== 'string') {
      return NextResponse.json({ error: 'Note ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // Fetch the existing note to ensure it belongs to this therapist and to check its locked status
    const existingNote = await prisma.clientNote.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Client note not found.' }, { status: 404 });
    }

    if (existingNote.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to update this note.' }, { status: 403 });
    }

    // IMPORTANT EHR Consideration: Prevent editing of locked notes
    if (existingNote.isLocked) {
      return NextResponse.json({ error: 'This note is locked and cannot be edited.' }, { status: 403 });
    }

    const requestBody = await req.json();
    // Use .partial() for PUT to allow updating only specific fields
    // Exclude fields that shouldn't be updatable via this route directly (like clientId, therapistId)
    const validationResult = clientNoteSchema.partial().omit({ clientId: true }).safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    const { id: _id, clientId: _clientId, therapistId: _therapistId, isLocked: _isLocked, lockedAt: _lockedAt, createdAt: _createdAt, ...updateData } = validationResult.data;

    // Ensure clientId is not changed via this update. If it needs to be, it's a more complex operation or should be disallowed.
    // The .omit({ clientId: true }) in the schema parsing step helps prevent this.

    const updatedNote = await prisma.clientNote.update({
      where: {
        id: noteId,
        // therapistId: therapist.id, // Already checked ownership
      },
      data: {
        ...updateData, // Contains validated noteType, content, dateOfService
        updatedAt: new Date(), // Explicitly set updatedAt
      },
       include: { // Optionally include client for context in response
        client: {
            select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(updatedNote, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating client note ${context.params.noteId}:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    if (error.code === 'P2025') { // Prisma: Record to update not found
      return NextResponse.json({ error: 'Client note not found for update.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while updating the note." }, { status: 500 });
  }
}


// --- DELETE Handler (Delete a specific client note by ID) ---
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { noteId } = context.params;

    if (!noteId || typeof noteId !== 'string') {
      return NextResponse.json({ error: 'Note ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // Fetch the note first to ensure it exists, belongs to this therapist, and to check locked status
    const noteToDelete = await prisma.clientNote.findUnique({
      where: { id: noteId },
    });

    if (!noteToDelete) {
      return NextResponse.json({ error: 'Client note not found.' }, { status: 404 });
    }

    if (noteToDelete.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to delete this note.' }, { status: 403 });
    }

    // IMPORTANT EHR Consideration: Prevent deletion of locked notes (or handle as "archiving")
    if (noteToDelete.isLocked) {
      return NextResponse.json({ error: 'This note is locked and cannot be deleted.' }, { status: 403 });
    }

    await prisma.clientNote.delete({
      where: {
        id: noteId,
        // therapistId: therapist.id, // Already checked ownership
      },
    });

    return NextResponse.json({ message: 'Client note deleted successfully.' }, { status: 200 }); // Or 204 No Content

  } catch (error: any)