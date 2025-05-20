// src/app/therapists/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";

// Import card components
import ClaimBanner from "@/components/therapistProfile/ClaimBanner";
import ProfileHeader from "@/components/therapistProfile/ProfileHeader";
import FinancesCard from "@/components/therapistProfile/FinancesCard";
import QualificationsCard from "@/components/therapistProfile/QualificationsCard";
import SpecialtiesCard from "@/components/therapistProfile/SpecialtiesCard";
import TreatmentStyleCard from "@/components/therapistProfile/TreatmentStyleCard";
import LocationCard from "@/components/therapistProfile/LocationCard";
import PersonalStatementCard from "@/components/therapistProfile/PersonalStatementCard";

// Import icons for breadcrumbs
import { Home, Users, MapPin as MapPinIcon, ChevronRight } from "lucide-react";

// Slugify utility
const slugify = (text: string | null | undefined): string =>
  text
    ? text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
    : "";

export type TherapistProfileData = NonNullable<
  Awaited<ReturnType<typeof getTherapistData>>
>;

async function getTherapistData(slug: string) {
  return prisma.therapist.findUnique({
    where: { slug },
    select: {
      id: true,
      userId: true,
      name: true,
      slug: true,
      tagline: true,
      imageUrl: true,
      phone: true,
      workEmail: true,
      website: true,
      primaryCredential: true,
      primaryCredentialAlt: true,
      profession: true,
      licenseStatus: true,
      licenseNumber: true,
      licenseState: true,
      educationSchool: true,
      educationDegree: true,
      educationYearGraduated: true,
      practiceStartYear: true,
      feeIndividual: true,
      feeCouples: true,
      slidingScale: true,
      freeConsultation: true,
      paymentMethods: true,
      feeComment: true,
      issues: true,
      topIssues: true, // Ensure 'topIssues' is in your Prisma schema and selected
      specialtyDescription: true,
      treatmentStyle: true,
      treatmentStyleDescription: true,
      primaryAddress: true,
      primaryCity: true,
      primaryState: true,
      primaryZip: true,
      telehealth: true,
      inPerson: true,
      locationDescription: true,
      nearbyCity1: true,
      nearbyCity2: true,
      nearbyCity3: true,
      personalStatement1: true,
      personalStatement2: true,
      personalStatement3: true,
      published: true,
      // communities: true, // Fetch if you added community badges
      // licenseExpirationMonth: true, licenseExpirationYear: true, // Fetch if needed by QualificationsCard
    },
  });
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  await Promise.resolve();
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    return {
      title: "Profile Not Found | TherapistDB",
      description:
        "The therapist profile you are looking for could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const name = therapist.name || "Therapist Profile";
  const credential = therapist.primaryCredential || "";
  const city = therapist.primaryCity || "";
  const state = therapist.primaryState || "";
  const locationPart =
    city && state
      ? `in ${city}, ${state}`
      : city
      ? `in ${city}`
      : state
      ? `in ${state}`
      : "";
  const mainSpecialty =
    therapist.issues && therapist.issues.length > 0
      ? therapist.issues[0]
      : therapist.profession || "Mental Health Professional";

  const title = `${name}${
    credential ? `, ${credential}` : ""
  } - ${mainSpecialty} ${locationPart} | TherapistDB`
    .trim()
    .replace(/ +/g, " ");
  const description = `Find information about ${name}${
    credential ? `, ${credential}` : ""
  }, a ${mainSpecialty} ${
    locationPart ? `practicing ${locationPart}` : ""
  }. Specialties include ${therapist.issues
    ?.slice(0, 3)
    .join(", ")}. Contact them via TherapistDB.`;

  const keywords = [
    therapist.name,
    therapist.primaryCredential,
    therapist.profession,
    "therapist",
    "counselor",
    "psychologist",
    city,
    state,
    ...(therapist.issues || []),
    ...(therapist.treatmentStyle || []),
  ]
    .filter(Boolean)
    .map((k) => k!.trim())
    .filter((k) => k.length > 1)
    .slice(0, 15);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/therapists/${therapist.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      profile: {
        firstName: therapist.name?.split(" ")[0],
        lastName: therapist.name?.split(" ").slice(1).join(" "),
        username: therapist.slug,
      },
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/therapists/${therapist.slug}`,
      images: therapist.imageUrl
        ? [
            {
              url: therapist.imageUrl,
              alt: `${therapist.name} - Profile Photo`,
            },
          ]
        : [],
    },
  };
}

export default async function TherapistProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  await Promise.resolve();
  const slug = decodeURIComponent(params.slug);
  const therapist = await getTherapistData(slug);

  if (!therapist || !therapist.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":
      therapist.profession === "Psychiatrist" ||
      therapist.primaryCredential === "MD"
        ? "Physician"
        : "MedicalBusiness",
    name: therapist.name,
    image: therapist.imageUrl || undefined,
    url: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/therapists/${slug}`,
    telephone: therapist.phone || undefined,
    email: therapist.workEmail || undefined,
    description:
      therapist.tagline ||
      therapist.personalStatement1 ||
      `Learn more about ${therapist.name}, a ${
        therapist.profession || "mental health professional"
      }.`,
    address:
      therapist.primaryAddress &&
      therapist.primaryCity &&
      therapist.primaryState &&
      therapist.primaryZip
        ? {
            "@type": "PostalAddress",
            streetAddress: therapist.primaryAddress,
            addressLocality: therapist.primaryCity,
            addressRegion: therapist.primaryState,
            postalCode: therapist.primaryZip,
            addressCountry: "US",
          }
        : undefined,
    ...(therapist.profession && { jobTitle: therapist.profession }),
    medicalSpecialty:
      [
        ...(therapist.profession ? [therapist.profession] : []),
        ...(therapist.issues || []),
      ]
        .filter(Boolean)
        .join(", ") || undefined,
    availableService: [
      ...(therapist.telehealth
        ? [{ "@type": "MedicalWebVisits", name: "Telehealth Sessions" }]
        : []),
      ...(therapist.inPerson
        ? [{ "@type": "MedicalClinic", name: "In-Person Sessions" }]
        : []),
    ].filter(Boolean),
  };
  Object.keys(jsonLd).forEach((key) => {
    const K = key as keyof typeof jsonLd;
    if (
      jsonLd[K] === undefined ||
      (Array.isArray(jsonLd[K]) && (jsonLd[K] as unknown[]).length === 0)
    ) {
      delete jsonLd[K];
    }
  });
  if (jsonLd.address && Object.keys(jsonLd.address).length === 0)
    delete jsonLd.address;

  // --- DEFINE ACCENT COLORS ---
  // It's better to define these in tailwind.config.js theme.extend.colors
  // e.g., 'brand-accent': '#B85C38', 'brand-accent-hover': '#A04F30', 'brand-beige': '#F1E9D5'
  // Then use classes like: text-brand-accent, bg-brand-beige
  const accentColor = "text-[#B85C38]"; // Rust/Terracotta - for text
  const accentHoverColor = "hover:text-[#A04F30]"; // Darker rust for text hover
  const accentBgColor = "bg-[#B85C38]"; // Rust/Terracotta - for backgrounds
  const accentBgHoverColor = "hover:bg-[#A04F30]"; // Darker rust for background hover
  const accentBorderColor = "border-[#B85C38]"; // Rust/Terracotta - for borders
  const pageBgColor = "bg-[#F1E9D5]"; // Light Creamy Beige for page background
  const cardBgColor = "bg-white"; // Or a very light off-white like bg-[#FAF6F0]

  return (
    <>
      <Script
        id="therapist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-50 min-h-screen print:bg-white">
        {" "}
        {/* Or bg-gray-50, bg-slate-100 */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-gray-600 mb-4 sm:mb-6 print:hidden"
          >
            <ol className="list-none p-0 inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <li className="flex items-center">
                <Home size={16} className="mr-1.5 text-gray-500" />
                <Link
                  href="/"
                  className={`${accentHoverColor} hover:underline`}
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight size={18} className="text-gray-400 mx-0.5" />
                <Users size={16} className="mr-1.5 text-gray-500" />
                <Link
                  href="/therapists"
                  className={`${accentHoverColor} hover:underline`}
                >
                  Therapists
                </Link>
              </li>
              {therapist.primaryState && (
                <li className="flex items-center">
                  <ChevronRight size={18} className="text-gray-400 mx-0.5" />
                  <MapPinIcon size={16} className="mr-1.5 text-gray-500" />
                  <Link
                    href={`/therapists?state=${slugify(
                      therapist.primaryState
                    )}`}
                    className={`${accentHoverColor} hover:underline`}
                  >
                    {therapist.primaryState}
                  </Link>
                </li>
              )}
              {therapist.primaryCity && therapist.primaryState && (
                <li className="flex items-center">
                  <ChevronRight size={18} className="text-gray-400 mx-0.5" />
                  <Link
                    href={`/therapists?city=${slugify(
                      therapist.primaryCity
                    )}&state=${slugify(therapist.primaryState)}`}
                    className={`${accentHoverColor} hover:underline`}
                  >
                    {therapist.primaryCity}
                  </Link>
                </li>
              )}
              <li
                className="flex items-center text-gray-800 font-medium"
                aria-current="page"
              >
                <ChevronRight size={18} className="text-gray-400 mx-0.5" />
                <span className="ml-1.5">
                  {therapist.name || "Therapist Profile"}
                </span>
              </li>
            </ol>
          </nav>

          <div className="space-y-6 md:space-y-8">
            {therapist.published && !therapist.userId && (
              <ClaimBanner
                therapistId={therapist.id}
                therapistName={therapist.name || "this therapist"}
                // ClaimBanner might use its own warning colors (e.g., amber)
              />
            )}

            <ProfileHeader
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              accentBgColor={accentBgColor}
              accentHoverColor={accentHoverColor}
              accentBgHoverColor={accentBgHoverColor}
              accentBorderColor={accentBorderColor}
              cardBgColor={cardBgColor} // Pass card background color
            />

            {(therapist.personalStatement1 || therapist.tagline) && (
              <PersonalStatementCard
                title="My Therapeutic Philosophy & Approach"
                statements={
                  [
                    therapist.personalStatement1,
                    therapist.personalStatement2,
                    therapist.personalStatement3,
                  ].filter((s) => s && s.trim() !== "") as string[]
                }
                tagline={therapist.tagline}
                accentColor={accentColor}
                accentBorderColor={accentBorderColor}
                cardBgColor={cardBgColor}
              />
            )}

            <SpecialtiesCard
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              cardBgColor={cardBgColor}
            />
            <TreatmentStyleCard
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              cardBgColor={cardBgColor}
            />
            <LocationCard
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              cardBgColor={cardBgColor}
            />
            <FinancesCard
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              cardBgColor={cardBgColor}
            />
            <QualificationsCard
              therapist={therapist as TherapistProfileData}
              accentColor={accentColor}
              cardBgColor={cardBgColor}
            />
          </div>
        </div>
      </div>
    </>
  );
}
