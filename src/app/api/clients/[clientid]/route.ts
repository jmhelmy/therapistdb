// src/app/api/clients/[clientId]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/lib/schemas/ehrSchemas'; // Used for PUT validation
import { z } from 'zod';

interface RouteContext {
  params: {
    clientId?: string;
  };
}

// --- GET Handler (Fetch a specific client by ID) ---
export async function GET(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { clientId } = context.params;

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Client ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    if (client.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to this client.' }, { status: 403 });
    }

    return NextResponse.json(client, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching client ${context.params.clientId}:`, error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching the client." }, { status: 500 });
  }
}

// --- PUT Handler (Update a specific client by ID) ---
export async function PUT(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { clientId } = context.params;

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Client ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    if (existingClient.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to update this client.' }, { status: 403 });
    }

    const requestBody = await req.json();
    // For PUT, you might allow partial updates. If so, use clientSchema.partial().
    // Here, we assume the full schema is used for validation, implying all required fields for update are sent,
    // or the schema marks them as optional.
    const validationResult = clientSchema.partial().safeParse(requestBody); // Using partial for PUT

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }
    
    // Ensure therapistId is not in the update payload from the client
    const { therapistId: _, ...clientUpdateData } = validationResult.data;


    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
        // therapistId: therapist.id, // Double-check ownership at DB level if desired
      },
      data: {
        ...clientUpdateData, // Spread validated data
        updatedAt: new Date(), // Explicitly set updatedAt if your Prisma schema doesn't auto-update on every modification
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating client ${context.params.clientId}:`, error);
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ error: 'A client with this email already exists for your account.' }, { status: 409 });
    }
    if (error.code === 'P2025') { // Prisma error code for "Record to update not found."
         return NextResponse.json({ error: 'Client not found for update.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while updating the client." }, { status: 500 });
  }
}

// --- NEW: DELETE Handler (Delete a specific client by ID) ---
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { clientId } = context.params;

    if (!clientId || typeof clientId !== 'string') {
      return NextResponse.json({ error: 'Client ID is required and must be a string.' }, { status: 400 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // Fetch the client first to ensure it exists and belongs to this therapist
    const clientToDelete = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientToDelete) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    }

    // Authorization: Ensure the client belongs to the logged-in therapist
    if (clientToDelete.therapistId !== therapist.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have access to delete this client.' }, { status: 403 });
    }

    // Perform the delete operation
    // Note: onDelete: Cascade in your Prisma schema for appointments and clientNotes linked to Client
    // will automatically delete those related records.
    await prisma.client.delete({
      where: {
        id: clientId,
        // therapistId: therapist.id, // You can add this for an extra layer of check at DB level
      },
    });

    return NextResponse.json({ message: 'Client deleted successfully.' }, { status: 200 }); // Or 204 No Content

  } catch (error: any) {
    console.error(`Error deleting client ${context.params.clientId}:`, error);
     if (error.code === 'P2025') { // Prisma error code for "Record to delete not found."
         return NextResponse.json({ error: 'Client not found for deletion.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while deleting the client." }, { status: 500 });
  }
}