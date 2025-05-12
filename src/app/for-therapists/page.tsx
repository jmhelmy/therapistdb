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

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-6 max-w-2xl mx-auto text-lg">
            <li>
              <strong>Sign Up &amp; Build Your Profile:</strong> Add your bio,
              specialties, insurance plans—and one hero photo.
            </li>
            <li>
              <strong>Go Live:</strong> We vet credentials within 24 hours and
              publish your profile.
            </li>
            <li>
              <strong>Get Booked:</strong> Clients contact you directly or
              schedule via your embedded calendar link.
            </li>
          </ol>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Features at a Glance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-3 text-left">Feature</th>
                  <th className="px-4 py-3 text-center">Starter ($10/mo)</th>
                  <th className="px-4 py-3 text-center">Pro ($25/mo)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Google-optimized listing", true, true],
                  ["One profile photo", true, true],
                  ["Secure messaging", true, true],
                  ["Basic analytics", true, true],
                  ["Featured placement", false, true],
                  ["Custom subdomain", false, true],
                  ["Priority support", false, true],
                ].map(([feat, starter, pro]) => (
                  <tr key={feat as string} className="border-t">
                    <td className="px-4 py-3">{feat}</td>
                    <td className="px-4 py-3 text-center">
                      {starter ? "✅" : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pro ? "✅" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Therapists Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "In my first week on TherapistDB I got three new clients—and all had pre-session questions answered via your secure chat. Game changer.",
                author: "Dr. Maya Reynolds, LMFT",
              },
              {
                quote:
                  "My practice went from crickets to full-schedule in two months. Love the analytics dashboard—it tells me exactly what’s working.",
                author: "Samuel Ortiz, LPC",
              },
            ].map((t, i) => (
              <blockquote
                key={i}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="italic mb-4">“{t.quote}”</p>
                <footer className="font-semibold">— {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: "Can I cancel anytime?", a: "Yes—no contracts, no penalties." },
              { q: "Is there a free trial?", a: "Enjoy a 14-day trial—no credit card required." },
              { q: "Do you verify credentials?", a: "Absolutely. We manually check your license and insurance." },
              { q: "Need a custom plan?", a: "Email support@therapistdb.com—happy to help." },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold">{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-blue-600 py-12">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Fill Your Calendar?</h2>
          {status === "authenticated" ? (
            <SubscribeButton email={email} />
          ) : (
            <a
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
            >
              Get Listed
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
