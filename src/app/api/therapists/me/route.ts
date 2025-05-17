// src/app/api/therapists/me/route.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { fullTherapistSchema } from '@/lib/schemas/therapistSchema'; // This now includes clientMagnetProfile
import slugify from 'slugify';

// GET /api/therapists/me — Load current user's therapist profile
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    // --- MODIFICATION: Include clientMagnetProfile when fetching ---
    include: {
      clientMagnetProfile: true, // Ensure this data is loaded with the therapist profile
    },
  });

  if (!therapist) {
    // If no therapist profile, but user exists, you might want to create a shell profile here,
    // or ensure ProfileWizard handles creating a new Therapist record on first save.
    // For now, assuming a therapist record is expected to exist if they are saving via PUT.
    return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 });
  }

  return NextResponse.json(therapist);
}

// PUT /api/therapists/me — Update current user's therapist profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    // Zod parsing will now also validate the clientMagnetProfile structure if present
    const parsedData = fullTherapistSchema.parse(data);

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      // This case should ideally be handled by ensuring a Therapist record is created
      // when a user first accesses the profile wizard or attempts their first save.
      // If you want to allow creation via this PUT, you'd use prisma.therapist.create() here
      // or prisma.therapist.upsert(). For now, assuming update of existing.
      return NextResponse.json({ error: 'Therapist profile not found. Cannot update.' }, { status: 404 });
    }

    // Slug generation logic (remains the same)
    let slug = therapist.slug;
    if (!slug && parsedData.name && parsedData.name.trim() !== '') {
      const base = slugify(parsedData.name, { lower: true, strict: true });
      let uniqueSlug = base;
      let suffix = 1;
      // Check for uniqueness against existing slugs, excluding the current therapist's ID if updating
      while (await prisma.therapist.findFirst({ where: { slug: uniqueSlug, NOT: { id: therapist.id } } })) {
        uniqueSlug = `${base}-${suffix++}`;
      }
      slug = uniqueSlug;
    }

    // Separate clientMagnetProfile data for clarity in the update operation
    const { clientMagnetProfile, ...therapistDataOnly } = parsedData;

    const updatedTherapist = await prisma.therapist.update({
      where: { userId: session.user.id },
      data: {
        ...therapistDataOnly, // Spread the rest of the therapist data
        slug: slug || therapist.slug, // Ensure slug is updated or retains old if not changed/generated

        // --- MODIFICATION: Handle nested write for ClientMagnetProfile ---
        clientMagnetProfile: clientMagnetProfile // If clientMagnetProfile is null/undefined in parsedData, this might remove the relation or do nothing.
          ? {
              upsert: { // Creates if it doesn't exist, updates if it does
                create: {
                  // These are fields from your ClientMagnetProfile Prisma model
                  aiGeneratedMarketingCopy: clientMagnetProfile.aiGeneratedMarketingCopy,
                  clientStoryExample: clientMagnetProfile.clientStoryExample,
                  videoUploadIdeas: clientMagnetProfile.videoUploadIdeas,
                  // Prisma automatically handles connecting this to the parent Therapist
                },
                update: {
                  aiGeneratedMarketingCopy: clientMagnetProfile.aiGeneratedMarketingCopy,
                  clientStoryExample: clientMagnetProfile.clientStoryExample,
                  videoUploadIdeas: clientMagnetProfile.videoUploadIdeas,
                  updatedAt: new Date(), // Explicitly set updatedAt if not auto-updated by Prisma in this context
                },
              },
            }
          : therapist.clientMagnetProfileId // If clientMagnetProfile is null, and you want to delete the existing one (if any)
            ? { delete: true } // Deletes the related ClientMagnetProfile if it exists and payload is null
            : undefined, // Or { disconnect: true } if you only want to sever the link but not delete.
                         // `undefined` will leave it as is if the payload for clientMagnetProfile is null/undefined.
                         // If clientMagnetProfile is always meant to be an object (even empty) from the form when the feature is touched,
                         // then an explicit delete/disconnect might be needed if the user "clears" that section.
                         // Given `clientMagnetProfile: null` in defaultFormData, `upsert` handles creation well.
                         // If a user later "clears" this section and `clientMagnetProfile` becomes `null` in payload,
                         // you need to decide if that means deleting the associated `ClientMagnetProfile` record.
                         // The `delete: true` conditional on `therapist.clientMagnetProfileId` (you'd need to query for this ID or relation)
                         // is one way to handle deletion.
                         // A simpler approach for now if `clientMagnetProfile` from payload is null:
                         // if `clientMagnetProfile` is null on payload, you can choose to:
                         //  1. Do nothing (leave existing `ClientMagnetProfile` as is).
                         //  2. Explicitly delete the `ClientMagnetProfile` record.
                         //  The current structure: if `clientMagnetProfile` is null, it effectively does nothing to the existing record via `undefined`.
                         //  If clientMagnetProfile is an object (even with all null fields), `upsert` will work.
                         //  Let's refine this to be more explicit for deletion if the object is passed as null.
      },
      include: {
        clientMagnetProfile: true, // Include it in the response
      },
    });

    // Refined logic for clientMagnetProfile update/delete:
    // This should be inside the `prisma.therapist.update` call, modifying the `data` object.
    // The `clientMagnetProfile` part of the `data` object would be:

    /*
    clientMagnetProfile: parsedData.clientMagnetProfile
      ? { // If clientMagnetProfile data is provided in the payload
          upsert: {
            create: {
              aiGeneratedMarketingCopy: parsedData.clientMagnetProfile.aiGeneratedMarketingCopy,
              clientStoryExample: parsedData.clientMagnetProfile.clientStoryExample,
              videoUploadIdeas: parsedData.clientMagnetProfile.videoUploadIdeas,
            },
            update: {
              aiGeneratedMarketingCopy: parsedData.clientMagnetProfile.aiGeneratedMarketingCopy,
              clientStoryExample: parsedData.clientMagnetProfile.clientStoryExample,
              videoUploadIdeas: parsedData.clientMagnetProfile.videoUploadIdeas,
            },
          },
        }
      : (await prisma.clientMagnetProfile.findUnique({ where: { therapistId: therapist.id } })) // Check if one exists
        ? { delete: true } // If payload is null/undefined AND one exists, delete it
        : undefined, // If payload is null/undefined AND none exists, do nothing
    */
    // The above refined logic requires an extra query if clientMagnetProfile is null in payload.
    // A simpler and often effective way with Prisma for optional one-to-one where the related record might be fully managed by the payload:
    // If `parsedData.clientMagnetProfile` is null, and you want to delete the associated record,
    // you might need to handle it as a separate step or ensure the `upsert` logic correctly handles a `null` payload
    // for the relation. Typically, if `parsedData.clientMagnetProfile` is `null`, setting `clientMagnetProfile: undefined`
    // in the update data won't create/update it. If it's an object, `upsert` is fine.
    // If you want to delete if it's explicitly set to null from the form:
    // (This requires careful handling in your Zod schema and form to differentiate "not touched" vs "explicitly cleared")

    // For now, the initial structure with `upsert` when `clientMagnetProfile` is an object,
    // and doing nothing (or relying on Prisma's default for a null relation update) when `clientMagnetProfile` is null, is a reasonable start.
    // If `clientMagnetProfile` being null should *always* delete the record, you'd add more explicit logic.


    return NextResponse.json({ therapist: updatedTherapist }); // Return the updated therapist with clientMagnetProfile

  } catch (error: any) {
    console.error('❌ PUT /api/therapists/me error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.format() }, { status: 400 });
    }
    return NextResponse.json(
      { error: error.message || 'Unexpected server error during profile update' },
      { status: 500 }
    );
  }
}