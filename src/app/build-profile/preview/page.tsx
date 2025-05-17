// src/app/profile/preview/page.tsx

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, UserCircle as UserIcon, MapPin, Briefcase, BookOpenText, Sparkles, ShieldCheckIcon } from 'lucide-react'; // Added more icons
import type { Metadata } from 'next';

// We'll need a type for the therapist data we fetch for the preview
// This would ideally be a subset of FullTherapistProfile or your Prisma.TherapistGetPayload
// For simplicity, we'll select fields directly in the query.
interface TherapistProfilePreviewData {
  id: string;
  name: string | null;
  slug: string | null;
  primaryCredential: string | null;
  primaryCredentialAlt: string | null;
  profession: string | null;
  imageUrl: string | null;
  coverImageUrl: string | null;
  tagline: string | null;
  personalStatement1: string | null;
  personalStatement2: string | null;
  personalStatement3: string | null;
  issues: string[]; // Assuming these are stored as arrays of strings
  treatmentStyle: string[];
  primaryCity: string | null;
  primaryState: string | null;
  telehealth: boolean | null;
  // Add other key fields you want to show in the preview
  clientMagnetProfile?: { // If you want to show AI generated copy specifically
    aiGeneratedMarketingCopy?: string | null;
  } | null;
}

export const metadata: Metadata = {
  title: 'Preview My Profile | TherapistDB',
  description: 'See how your public profile appears to potential clients.',
};

export default async function PreviewProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/profile/preview'); // Redirect to login if not authenticated
  }

  const therapistWithProfile = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      primaryCredential: true,
      primaryCredentialAlt: true,
      profession: true,
      imageUrl: true,
      coverImageUrl: true,
      tagline: true,
      personalStatement1: true,
      personalStatement2: true,
      personalStatement3: true,
      issues: true,
      treatmentStyle: true,
      primaryCity: true,
      primaryState: true,
      telehealth: true,
      clientMagnetProfile: { // Include if you want to display it separately
        select: {
          aiGeneratedMarketingCopy: true,
        },
      },
    },
  });

  if (!therapistWithProfile) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-xl text-gray-700">Your therapist profile data could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link href="/build-profile">Go to Profile Editor</Link>
        </Button>
      </div>
    );
  }

  const profile = therapistWithProfile as TherapistProfilePreviewData; // Cast for easier access

  const fullPersonalStatement = [profile.personalStatement1, profile.personalStatement2, profile.personalStatement3]
    .filter(Boolean) // Remove null or empty strings
    .join('\n\n');

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          {/* Link back to where ProfileSubNavigation is, e.g., /build-profile or /account */}
          <Link href="/build-profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile Management
          </Link>
        </Button>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-md text-sm">
          This is a preview of your public profile.
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Cover Image */}
        <div className={`h-48 sm:h-64 bg-gray-300 ${profile.coverImageUrl ? '' : 'flex items-center justify-center'}`}>
          {profile.coverImageUrl ? (
            <Image src={profile.coverImageUrl} alt="Cover photo" width={1200} height={400} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-16 w-16 text-gray-400" /> /* Placeholder for missing icon */
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* Profile Header: Avatar, Name, Credentials */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-20 sm:-mt-24 mb-6">
            <div className={`relative h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden ${profile.imageUrl ? '' : 'p-2'}`}>
              {profile.imageUrl ? (
                <Image src={profile.imageUrl} alt={profile.name || 'Therapist'} width={160} height={160} className="rounded-full object-cover" />
              ) : (
                <UserIcon className="h-20 w-20 text-gray-400" />
              )}
            </div>
            <div className="mt-4 sm:mt-8 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{profile.name || 'Your Name Here'}</h1>
              <p className="text-md text-teal-600 font-medium">
                {profile.primaryCredential}
                {profile.primaryCredentialAlt && `, ${profile.primaryCredentialAlt}`}
              </p>
              <p className="text-sm text-gray-500">{profile.profession}</p>
            </div>
          </div>
          
          {/* Location & Telehealth Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={18} className="mr-2" />
              <span>
                {profile.primaryCity && profile.primaryState ? `${profile.primaryCity}, ${profile.primaryState}` : 'Location not specified'}
              </span>
            </div>
            {profile.telehealth && (
              <div className="flex items-center text-green-600">
                <ShieldCheckIcon size={18} className="mr-2" />
                <span>Offers Telehealth Sessions</span>
              </div>
            )}
          </div>


          {/* Tagline */}
          {profile.tagline && (
            <blockquote className="mb-6 p-4 bg-gray-50 border-l-4 border-teal-500 rounded">
              <p className="text-lg italic text-gray-700">"{profile.tagline}"</p>
            </blockquote>
          )}

          {/* Personal Statement / About Section */}
          {(fullPersonalStatement || profile.clientMagnetProfile?.aiGeneratedMarketingCopy) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <BookOpenText size={20} className="mr-2 text-teal-600" /> About Me
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 whitespace-pre-line">
                {/* Prioritize AI generated copy if available and desired for preview, or show combined */}
                <p>{profile.clientMagnetProfile?.aiGeneratedMarketingCopy || fullPersonalStatement || "Your personal statement will appear here."}</p>
              </div>
            </div>
          )}
          
          {/* Issues Treated */}
          {profile.issues && profile.issues.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <Sparkles size={20} className="mr-2 text-teal-600" /> Specialties & Issues
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.issues.map(issue => (
                  <span key={issue} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{issue}</span>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Approaches */}
          {profile.treatmentStyle && profile.treatmentStyle.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <Briefcase size={20} className="mr-2 text-teal-600" /> My Approach
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.treatmentStyle.map(style => (
                  <span key={style} className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{style}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/build-profile">
                <Edit className="mr-2 h-5 w-5" /> Edit My Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple placeholder for missing image icon
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
);