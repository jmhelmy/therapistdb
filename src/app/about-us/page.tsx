// src/app/about-us/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Heart, Search, Zap, ShieldCheck, Lightbulb, CheckCircle } from 'lucide-react'; // Example icons

export const metadata: Metadata = {
  title: "About TherapistDB | Our Mission to Connect Therapists & Clients",
  description: "Learn about TherapistDB's mission to empower mental health professionals by providing a modern, effective, and ethical platform to connect with individuals seeking therapy. Discover our story, values, and commitment.",
  keywords: [
    "about therapistdb", "therapist directory mission", "mental health platform",
    "counselor directory about", "find a therapist", "list your practice",
    "therapy resources", "mental wellness community"
  ],
};

// Define a type for team members if you add that section
// interface TeamMember {
//   name: string;
//   role: string;
//   imageUrl?: string;
//   bio?: string;
// }

export default function AboutUsPage() {
  // Placeholder for team members - replace with actual data or remove section
  // const teamMembers: TeamMember[] = [
  //   { name: "Dr. Evelyn Reed", role: "Founder & Lead Therapist Advisor", imageUrl: "/path/to/evelyn.jpg", bio: "Driven by a passion to make quality mental healthcare accessible..." },
  //   { name: "Alex Chen", role: "Lead Developer & Technologist", imageUrl: "/path/to/alex.jpg", bio: "Focused on building intuitive and secure platform experiences..." },
  // ];

  return (
    <>
      {/* JSON-LD Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TherapistDB",
            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com", // Replace with your actual domain
            "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"}/logotherapistdb.png`, // Replace with your actual logo URL
            "description": metadata.description,
            "sameAs": [ // Add your social media profile URLs here
              "https://facebook.com/yourtherapistdb",
              "https://twitter.com/yourtherapistdb",
              "https://linkedin.com/company/yourtherapistdb"
            ],
            "contactPoint": { // Optional, if you have a general contact
              "@type": "ContactPoint",
              "telephone": "+1-555-THERAPY", // Replace with your actual contact if applicable
              "contactType": "Customer Support"
            }
          })
        }}
      />

      <main className="min-h-screen bg-slate-50 text-gray-700">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 text-white py-20 md:py-28 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <Lightbulb size={48} className="mx-auto mb-6 text-yellow-300" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              About TherapistDB
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 mb-2 max-w-2xl mx-auto">
              Empowering Connections, Fostering Wellness.
            </p>
            <p className="text-md sm:text-lg text-teal-200 max-w-2xl mx-auto">
              We're dedicated to simplifying the search for quality mental healthcare, making it easier for therapists to reach those in need and for individuals to find the right support.
            </p>
          </div>
        </section>

        {/* Our Story / Mission Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto max-w-3xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Guiding Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At TherapistDB, we believe that finding the right therapist shouldn't add to life's stresses.
                Our mission is to create the most trusted, effective, and user-friendly platform that bridges the gap between dedicated mental health professionals and individuals seeking support. We're committed to enhancing visibility for therapists and simplifying the discovery process for clients.
              </p>
            </div>

            {/* Optional: Founder's Note - keep it brief and authentic */}
            {/* <div className="bg-slate-50 p-8 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-2xl font-semibold text-teal-700 mb-3 text-center">A Note From Our Founder</h3>
              <p className="text-gray-600 italic mb-4 text-center">
                "Having experienced the challenges of finding specialized therapy myself, and seeing colleagues struggle to connect with the clients they're best equipped to help, I was inspired to build TherapistDB. My goal is to leverage technology to make meaningful therapeutic connections more accessible for everyone."
              </p>
              <p className="text-sm font-medium text-gray-700 text-center">– [Founder's Name], Founder of TherapistDB</p>
            </div> */}

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div>
                <h3 className="text-2xl font-semibold text-teal-700 mb-3 flex items-center">
                  <Users size={28} className="mr-3 text-teal-500" /> For Therapists
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You dedicate your lives to helping others. We're here to help you. TherapistDB offers a modern, SEO-optimized platform to showcase your unique practice, specialties, and approach. Our focus is on connecting you with clients who are genuinely seeking your expertise, reducing your marketing burden and allowing you to focus on what you do best.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Enhanced Visibility:</strong> Reach clients actively searching in your area and for your specialties.</li>
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Quality Connections:</strong> Attract individuals whose needs align with your expertise.</li>
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Simple Profile Management:</strong> Easily create and update a comprehensive professional profile.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-teal-700 mb-3 flex items-center">
                  <Heart size={28} className="mr-3 text-red-500" /> For Individuals Seeking Support
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Finding the right therapist is a crucial step towards healing and growth. TherapistDB provides a comprehensive, easy-to-navigate directory of verified mental health professionals. Search by location, specialty, insurance, and more to find a therapist who truly understands your needs.
                </p>
                 <ul className="space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Verified Professionals:</strong> Connect with licensed and vetted therapists.</li>
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Targeted Search:</strong> Find the right fit based on your specific concerns and preferences.</li>
                  <li className="flex items-start"><CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 shrink-0"/> <strong>Informative Profiles:</strong> Learn about therapists' approaches, specialties, and experience.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-slate-100 px-4">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: <ShieldCheck size={32} className="text-teal-600"/>, title: "Trust & Safety", desc: "Prioritizing verified professionals and data security for a safe experience." },
                        { icon: <Search size={32} className="text-teal-600"/>, title: "Accessibility", desc: "Making it easier for everyone to find and connect with mental health support." },
                        { icon: <Zap size={32} className="text-teal-600"/>, title: "Effectiveness", desc: "Building tools that genuinely help therapists grow and clients find the right care." },
                        { icon: <Users size={32} className="text-teal-600"/>, title: "Community", desc: "Fostering a supportive ecosystem for both therapists and those seeking help." },
                        { icon: <Lightbulb size={32} className="text-teal-600"/>, title: "Innovation", desc: "Continuously improving our platform with user feedback and modern technology." },
                        { icon: <Heart size={32} className="text-teal-600"/>, title: "Compassion", desc: "Operating with empathy and understanding at the core of all we do." },
                    ].map(value => (
                        <div key={value.title} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="mb-4 p-3 bg-teal-50 rounded-full">{value.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Team Section (Optional - uncomment and populate if you have a team) */}
        {/*
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Meet Our Team</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10">
              {teamMembers.map(member => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  {member.imageUrl && (
                    <Image src={member.imageUrl} alt={member.name} width={128} height={128} className="rounded-full mb-4 shadow-lg" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-teal-600 font-medium mb-2">{member.role}</p>
                  {member.bio && <p className="text-sm text-gray-600">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-teal-50 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Join the TherapistDB Community
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're a therapist looking to expand your reach or an individual seeking support, TherapistDB is here to help you connect.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/for-therapists" // Or directly to /register?role=therapist
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold text-lg hover:bg-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                List Your Practice
              </Link>
              <Link
                href="/therapists"
                className="px-8 py-3 bg-transparent border-2 border-teal-600 text-teal-600 rounded-lg font-semibold text-lg hover:bg-teal-50 transition-colors duration-300"
              >
                Find a Therapist
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}