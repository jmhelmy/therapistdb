// src/app/page.tsx

import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import BrowseByState from '@/components/home/BrowseByState'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'TherapistDB | Find a Mental Health Professional',
  description:
    'TherapistDB connects you with licensed therapists and counselors—search by ZIP code, specialty, or online across the U.S.',
  keywords: [
    'therapist',
    'counselor',
    'mental health',
    'online therapy',
    'find therapist',
    'therapy near me',
    'licensed therapist',
    'counseling directory'
  ]
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/build-profile')

  const categories = [
    { name: 'Anxiety & Stress', slug: 'anxiety', emoji: '😰' },
    { name: 'Depression',        slug: 'depression', emoji: '😔' },
    { name: 'Relationships',     slug: 'relationships', emoji: '❤️' },
    { name: 'Trauma & PTSD',     slug: 'trauma-ptsd', emoji: '🛡️' },
    { name: 'Parenting',         slug: 'parenting', emoji: '👨‍👩‍👦' },
    { name: 'Grief & Loss',      slug: 'grief-loss', emoji: '😢' },
    { name: 'Addiction',         slug: 'addiction-recovery', emoji: '🚫' },
    { name: 'Self-Esteem',       slug: 'self-esteem', emoji: '👍' },
    { name: 'Workplace Stress',  slug: 'work-stress', emoji: '💼' },
    { name: 'Life Transitions',  slug: 'life-transitions', emoji: '🔄' },
  ]

  const cities = [
    'Los Angeles',
    'New York City',
    'Chicago',
    'Houston',
    'Miami',
    'Phoenix',
    'Seattle',
    'Denver',
    'Atlanta',
    'San Diego'
  ]

  const recentPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true
    }
  })

  return (
    <main className="bg-[#f9faf7] min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-[#1a2d3e] mb-8">
          Find a Mental Health Professional
        </h1>
        <form
          action="/therapists"
          method="GET"
          className="max-w-md mx-auto flex flex-col gap-4"
        >
          <label htmlFor="zip" className="sr-only">
            ZIP code
          </label>
          <input
            id="zip"
            type="text"
            name="zip"
            placeholder="Enter ZIP code"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="bg-[#009688] hover:bg-[#00796B] text-white py-2 rounded-md font-medium"
          >
            Search Therapists
          </button>
        </form>
      </section>

      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-[#1a2d3e]">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/therapists?specialty=${cat.slug}`}
              className="bg-white border rounded-md shadow-sm p-4 flex flex-col items-center justify-center text-sm text-[#425F80] text-center h-24 hover:bg-gray-50"
            >
              <span className="text-2xl mb-1">{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Common Cities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-[#1a2d3e]">
          Common Cities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/therapists?city=${encodeURIComponent(city)}`}
              className="bg-white border rounded-md shadow-sm p-4 flex items-center justify-center text-sm text-[#425F80] text-center h-24 hover:bg-gray-50"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by State */}
      <BrowseByState />

      {/* From the Blog */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6 text-center text-[#1a2d3e]">
          From the Blog
        </h2>
        <ul className="space-y-4 max-w-md mx-auto">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-medium text-teal-600 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block px-6 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50"
          >
            View all articles
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-[#425F80]">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/press">Press</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/help">Help Center</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Explore</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/therapists">Find a Therapist</Link>
              </li>
              <li>
                <Link href="/for-therapists">List Your Practice</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Connect</h4>
            <p>Follow us on:</p>
            <ul className="flex space-x-4 mt-2">
              <li>
                <Link href="https://facebook.com/therapistdb">Facebook</Link>
              </li>
              <li>
                <Link href="https://twitter.com/therapistdb">Twitter</Link>
              </li>
              <li>
                <Link href="https://linkedin.com/company/therapistdb">LinkedIn</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
