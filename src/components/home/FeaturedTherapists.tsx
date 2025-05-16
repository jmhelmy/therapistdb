// src/components/home/FeaturedTherapists.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react'; // Example icons

// Define the data structure for a featured therapist card
// This should be a subset of what TherapistCard.tsx uses, or TherapistDataForCard
interface FeaturedTherapist {
  id: string;
  name: string | null;
  slug: string;
  imageUrl: string | null;
  tagline: string | null;
  primaryCity: string | null;
  primaryState: string | null;
  issues: string[] | null; // To show a few key specialties
}

async function getFeaturedTherapists(): Promise<FeaturedTherapist[]> {
  // Logic to select featured therapists:
  // Option 1: Manually curated list of IDs (if you have a way to flag them in DB)
  // Option 2: Random selection (can be inefficient on large DBs without indexing)
  // Option 3: Recently updated/claimed profiles
  // Option 4: Profiles with high completeness scores (if you track that)
  // For now, let's take a few published ones with images and some core data.
  // You might want a more sophisticated selection logic.

  const therapists = await prisma.therapist.findMany({
    where: {
      published: true,
      imageUrl: { not: null }, // Ensure they have an image
      // Add other criteria for "featured" status if you have them
      // e.g., isFeatured: true,
    },
    take: 4, // Number of featured therapists to show (e.g., 3 or 4 for a row)
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      tagline: true,
      primaryCity: true,
      primaryState: true,
      issues: true, // Select top 3-5 issues perhaps
    },
    // Consider a specific order if not random, e.g., orderBy: { lastLogin: 'desc' } (if claimed)
    // or orderBy: { overallRating: 'desc' } (if you have ratings)
  });

  return therapists as FeaturedTherapist[]; // Cast if your select matches exactly
}


export default async function FeaturedTherapists() {
  const therapists = await getFeaturedTherapists();

  if (!therapists || therapists.length === 0) {
    return null; // Don't render the section if no featured therapists are found
  }

  return (
    <section className="bg-white py-16 md:py-20 px-4"> {/* Or another contrasting background */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Meet Our Featured Therapists
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover experienced professionals ready to support your mental wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {therapists.map((therapist) => (
            <Link
              href={`/therapists/${therapist.slug}`}
              key={therapist.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56">
                <Image
                  src={therapist.imageUrl || '/default-avatar.png'} // Ensure fallback exists
                  alt={`${therapist.name || 'Therapist'}'s profile photo`}
                  fill // Use fill for responsive images within a sized container
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors mb-1 truncate">
                  {therapist.name || 'Therapist Profile'}
                </h3>
                {therapist.primaryCity && therapist.primaryState && (
                  <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <MapPin size={12} className="mr-1 shrink-0" />
                    {therapist.primaryCity}, {therapist.primaryState}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow"> {/* line-clamp for brief tagline */}
                  {therapist.tagline || 'Dedicated mental health professional.'}
                </p>
                {therapist.issues && therapist.issues.length > 0 && (
                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Specializes in:</p>
                    <div className="flex flex-wrap gap-1">
                      {therapist.issues.slice(0, 2).map(issue => ( // Show first 2-3 issues
                        <span key={issue} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
         <div className="text-center mt-12">
            <Link
                href="/therapists"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-md transition duration-150 ease-in-out shadow-md hover:shadow-lg"
            >
                Find More Therapists
            </Link>
        </div>
      </div>
    </section>
  );
}