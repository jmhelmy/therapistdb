// src/app/for-therapists/page.tsx

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { SubscribeButton } from "@/components/SubscribeButton";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? "";

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Grow Your Practice. Reach More Clients.
          </h1>
          <p className="text-lg mb-8">
            TherapistDB is the only therapist directory built by counselors, for
            counselors—no fluff, just qualified leads.
          </p>
          <div className="flex justify-center gap-4">
            {status === "authenticated" ? (
              <SubscribeButton email={email} />
            ) : (
              <a
                href="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Listed for Free Trial
              </a>
            )}
            <a
              href="#pricing"
              className="px-6 py-3 bg-transparent border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why TherapistDB?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Be Found Instantly",
                desc:
                  "Optimized for Google so you rank top for local searches.",
              },
              {
                title: "High-Intent Leads",
                desc:
                  "Users are actively looking to book sessions, not browse.",
              },
              {
                title: "Secure Messaging",
                desc:
                  "End-to-end encryption keeps client inquiries safe.",
              },
              {
                title: "Built-In Analytics",
                desc:
                  "Track views, clicks, and bookings with zero guesswork.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
