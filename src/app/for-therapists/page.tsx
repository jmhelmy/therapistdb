// src/app/for-therapists/page.tsx
"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Use Next.js Link for internal navigation
import { SubscribeButton } from "@/components/SubscribeButton"; // Assuming this component is set up
import { CheckCircle, Users, ShieldCheck, BarChart3, Target, MessageSquare, Star, CalendarCheck, Edit3 } from "lucide-react"; // Icons

// Define feature data
const features = [
  {
    icon: <Target size={32} className="text-teal-500 mb-4" />,
    title: "Get Discovered by Ideal Clients",
    desc: "Our SEO-optimized platform helps clients actively seeking therapy find you based on your specialty, location, and approach.",
  },
  {
    icon: <Users size={32} className="text-teal-500 mb-4" />,
    title: "Quality Referrals, Not Just Clicks",
    desc: "Receive inquiries from individuals genuinely looking to book sessions, reducing time wasted on unqualified leads.",
  },
  {
    icon: <Edit3 size={32} className="text-teal-500 mb-4" />,
    title: "Showcase Your Unique Practice",
    desc: "Create a comprehensive profile highlighting your expertise, treatment philosophies, and what makes your practice unique.",
  },
  {
    icon: <CalendarCheck size={32} className="text-teal-500 mb-4" />,
    title: "Streamlined Client Management (Soon)",
    desc: "Future features include integrated booking and secure messaging to simplify your client interactions (coming soon).",
  },
];

const benefits = [
    { title: "Increase Your Visibility", text: "Rank higher in local and specialized searches." },
    { title: "Save on Marketing Costs", text: "Attract clients without expensive ad campaigns." },
    { title: "Build Your Reputation", text: "Collect reviews and showcase your expertise." },
    { title: "Focus on Therapy", text: "Spend less time on admin, more on clients." },
]

export default function ForTherapistsPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? ""; // Used if SubscribeButton needs it directly

  const isLoadingSession = status === "loading";

  return (
    <main className="bg-slate-50 text-gray-700">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 text-white py-20 md:py-28 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Grow Your Practice. Connect With More Clients.
          </h1>
          <p className="text-lg sm:text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Join TherapistDB, the modern directory designed by therapists, for therapists.
            Showcase your expertise and attract clients actively seeking your services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isLoadingSession ? (
                 <div className="h-12 w-48 bg-teal-400 animate-pulse rounded-lg"></div>
            ) : session ? (
              // If user is logged in and already has a subscription, link to dashboard
              // This requires knowing the subscription status. For now, showing SubscribeButton.
              <SubscribeButton email={email} buttonText="Manage Subscription" className="px-8 py-3 text-lg" />
            ) : (
              <Link
                href="/register?role=therapist" // Add role for clarity if needed
                className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold text-lg hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Free Trial
              </Link>
            )}
            <Link
              href="#pricing" // Link to pricing section on this page
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors duration-300"
            >
              View Pricing Plans
            </Link>
          </div>
          <p className="text-sm text-teal-200 mt-6">No long-term contracts. Cancel anytime.</p>
        </div>
      </section>

      {/* "Why TherapistDB?" Enhanced Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              The Modern Directory Built for Your Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the tools and visibility you need, so you can focus on what you do best: helping clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-50/50 p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Benefits Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple Steps to Elevate Your Practice</h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">Joining TherapistDB is quick and easy, putting you in front of clients in minutes.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">1</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Profile</h3>
                    <p className="text-sm text-gray-600">Sign up and build a comprehensive, professional profile in our easy-to-use wizard.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">2</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Discovered</h3>
                    <p className="text-sm text-gray-600">Potential clients find you through targeted searches based on their specific needs.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6">
                    <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">3</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect & Grow</h3>
                    <p className="text-sm text-gray-600">Receive direct inquiries and focus on expanding your practice and impact.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Trusted by Therapists Like You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Testimonial Structure - Replace with real or illustrative ones */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 p-8 rounded-lg shadow-md border border-gray-100">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" fill="currentColor" />
                <p className="text-gray-600 italic mb-6">
                  "TherapistDB has significantly increased my client inquiries. The platform is intuitive and effective!"
                </p>
                <p className="font-semibold text-gray-700">- Dr. Jane Doe, LMFT</p>
                <p className="text-sm text-gray-500">City, State</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Placeholder) - Link with id="pricing" */}
      <section id="pricing" className="py-16 md:py-24 bg-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
            Choose the plan that's right for your practice. No hidden fees, ever.
          </p>
          {/* Placeholder for pricing cards/table */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
             {/* Example Plan Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-teal-600 mb-2">Starter</h3>
                <p className="text-4xl font-bold text-gray-800 mb-1">$29<span className="text-lg font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500 mb-6">Perfect for getting started.</p>
                <ul className="space-y-3 text-sm text-gray-600 text-left mb-8 flex-grow">
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Basic Profile Listing</li>
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Up to 10 Specialties</li>
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Email Support</li>
                </ul>
                <Link href="/register?plan=starter" className="w-full mt-auto block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">Get Started</Link>
            </div>
            {/* Add 1-2 more plan cards */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-teal-500 flex flex-col relative"> {/* Highlighted Plan */}
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</div>
                <h3 className="text-2xl font-semibold text-teal-600 mb-2 mt-2">Professional</h3>
                <p className="text-4xl font-bold text-gray-800 mb-1">$49<span className="text-lg font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500 mb-6">For growing practices.</p>
                <ul className="space-y-3 text-sm text-gray-600 text-left mb-8 flex-grow">
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Enhanced Profile Listing</li>
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Unlimited Specialties</li>
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Featured in Search (Soon)</li>
                    <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2 shrink-0"/> Priority Support</li>
                </ul>
                <Link href="/register?plan=professional" className="w-full mt-auto block text-center px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors">Choose Plan</Link>
            </div>
             {/* Add one more plan if needed */}
          </div>
          <p className="text-sm text-gray-500 mt-8">All plans start with a 14-day free trial. Cancel anytime.</p>
        </div>
      </section>

      {/* FAQ Section (Placeholder) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {/* Example FAQ Item - Repeat for more questions */}
            <div>
              <h3 className="font-semibold text-gray-700 text-lg">How do I get listed?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Simply click on "Start Your Free Trial" or "Get Listed", create an account, and follow the steps in our profile builder. You can have your profile live in minutes!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 text-lg">Is there a commitment?</h3>
              <p className="text-sm text-gray-600 mt-1">
                No, TherapistDB offers flexible monthly plans. You can cancel your subscription at any time without penalty.
              </p>
            </div>
             {/* Add 2-3 more FAQs */}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-teal-600 text-white">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Practice?
          </h2>
          <p className="text-lg mb-8">
            Join a growing community of therapists reaching new clients and making a bigger impact.
          </p>
          <Link
            href="/register?role=therapist"
            className="px-10 py-4 bg-white text-teal-600 rounded-lg font-semibold text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>
      {/* Consider adding your standard site footer component here */}
    </main>
  );
}