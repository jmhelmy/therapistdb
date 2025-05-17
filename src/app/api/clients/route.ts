// src/app/api/clients/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Your NextAuth options
import { prisma } from '@/lib/prisma';   // Your Prisma client instance
import { clientSchema } from '@/lib/schemas/ehrSchemas'; // Import the Zod schema for Client
                                                       // Adjust path if you placed it elsewhere (e.g., therapistSchema.ts)
import { z } from 'zod';

// --- POST Handler (Create a new client) ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to create a client.' }, { status: 401 });
    }

    // Find the therapist ID associated with the current user
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }, // Or however your User is linked to Therapist
      select: { id: true } // We only need the therapist's ID
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    const requestBody = await req.json();

    // Validate the request body against the clientSchema
    const validationResult = clientSchema.safeParse(requestBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.format() }, { status: 400 });
    }

    // For creation, we typically don't want to allow an 'id' to be passed in the payload.
    // If clientSchema includes an optional 'id', it's good to exclude it here.
    const { id: _, ...clientData } = validationResult.data; // Destructure to exclude 'id' if present

    // Create the new client, associating it with the logged-in therapist
    const newClient = await prisma.client.create({
      data: {
        ...clientData, // Spread validated client data (firstName, lastName, email, etc.)
        therapistId: therapist.id, // Link to the therapist
      },
    });

    return NextResponse.json(newClient, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error("Error creating client:", error);
    if (error instanceof z.ZodError) { // Should be caught by safeParse, but as a fallback
        return NextResponse.json({ error: "Validation error during processing.", details: error.format() }, { status: 400 });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        // This specific error handling depends on your Prisma schema's unique constraints.
        // If email is not globally unique but unique per therapist, the constraint would be on (therapistId, email).
        return NextResponse.json({ error: 'A client with this email already exists for your account.' }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: error.message || "An unexpected error occurred while creating the client." }, { status: 500 });
  }
}

// --- NEW: GET Handler (List all clients for the logged-in therapist) ---
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to view clients.' }, { status: 401 });
    }

    // Find the therapist ID associated with the current user
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }, // Or however your User is linked to Therapist
      select: { id: true }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found for the current user.' }, { status: 404 });
    }

    // Fetch all clients linked to this therapist
    // You might want to add pagination here later for performance if a therapist has many clients
    // e.g., using `take` and `skip` based on URL query parameters from `req.nextUrl.searchParams`
    const clients = await prisma.client.findMany({
      where: {
        therapistId: therapist.id,
      },
      orderBy: [ // Optional: default sorting
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
      // For a list view, you might not need all client details.
      // Consider using `select` to pick only necessary fields to optimize payload size.
      // Example:
      // select: {
      //   id: true,
      //   firstName: true,
      //   lastName: true,
      //   email: true,
      //   phone: true,
      //   // Add other summary fields you need for the client list
      // }
    });

    return NextResponse.json(clients, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred while fetching clients." }, { status: 500 });
  }
}