// src/app/page.tsx
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth'; // Assuming this path is correct
import BrowseByState from '@/components/home/BrowseByState'; // Assuming this path is correct
import { prisma } from '@/lib/prisma'; // Assuming this path is correct
import { Search, Users, MapPin, FileText, MessageSquare, Smile, Heart, Shield, Users2, Brain, GitFork, UsersRound, Briefcase, RefreshCw } from 'lucide-react'; // Example icons

// SEO Metadata - Your existing metadata is good.
export const metadata: Metadata = {
  title: 'TherapistDB | Find Your Ideal Mental Health Professional', // Slightly more benefit-oriented
  description:
    'Easily find and connect with licensed therapists, counselors, and psychologists near you or online. Search by specialty, location, and more on TherapistDB.', // More active voice
  keywords: [ // Good set of keywords
    'therapist', 'counselor', 'psychologist', 'mental health', 'therapy', 'online therapy',
    'find a therapist', 'therapists near me', 'licensed therapist directory', 'counseling services',
    'anxiety help', 'depression support', 'couples counseling', 'ptsd treatment',
  ],
  // Consider adding Open Graph and Twitter Card defaults if not handled globally in layout.tsx
};

// Data for sections - could be moved to a separate data file or fetched if more dynamic
const popularCategories = [
    { name: 'Anxiety & Stress', slug: 'anxiety-stress', icon: <Smile size={28} className="text-yellow-500"/>, href: "/therapists?issue=Anxiety" },
    { name: 'Depression', slug: 'depression', icon: <Users size={28} className="text-blue-500"/>, href: "/therapists?issue=Depression" }, // Placeholder icon
    { name: 'Relationships', slug: 'relationships', icon: <Heart size={28} className="text-red-500"/>, href: "/therapists?specialty=Couples%20Counseling" },
    { name: 'Trauma & PTSD', slug: 'trauma-ptsd', icon: <Shield size={28} className="text-indigo-500"/>, href: "/therapists?issue=Trauma" },
    { name: 'Parenting', slug: 'parenting', icon: <Users2 size={28} className="text-green-500"/>, href: "/therapists?specialty=Parenting" },
    { name: 'Grief & Loss', slug: 'grief-loss', icon: <Brain size={28} className="text-purple-500"/>, href: "/therapists?issue=Grief" }, // Placeholder icon
    { name: 'Addiction', slug: 'addiction-recovery', icon: <GitFork size={28} className="text-orange-500"/>, href: "/therapists?specialty=Addiction" }, // Placeholder icon
    { name: 'Self-Esteem', slug: 'self-esteem', icon: <UsersRound size={28} className="text-pink-500"/>, href: "/therapists?issue=Self-Esteem" }, // Placeholder icon
    { name: 'Workplace Stress', slug: 'workplace-stress', icon: <Briefcase size={28} className="text-gray-500"/>, href: "/therapists?issue=Workplace%20Stress" },
    { name: 'Life Transitions', slug: 'life-transitions', icon: <RefreshCw size={28} className="text-cyan-500"/>, href: "/therapists?issue=Life%20Transitions" },
];

const commonCities = [
  { name: 'Los Angeles', stateSlug: 'california', query: 'Los%20Angeles' },
  { name: 'New York City', stateSlug: 'new-york', query: 'New%20York%20City' },
  { name: 'Chicago', stateSlug: 'illinois', query: 'Chicago' },
  { name: 'Houston', stateSlug: 'texas', query: 'Houston' },
  { name: 'Miami', stateSlug: 'florida', query: 'Miami' },
  // Consider adding more or making this list dynamic
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  // Redirect logged-in users to their dashboard or profile build
  if (session?.user) {
    // Check if they have a therapist profile already, if not, redirect to build-profile
    // This logic might be more complex depending on your user roles and profile states
    const therapistProfile = await prisma.therapist.findUnique({
        where: { userId: session.user.id }
    });
    if (therapistProfile) {
        redirect('/account'); // Or a therapist dashboard
    } else {
        redirect('/build-profile');
    }
  }

  const recentPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3, // Show 3-5 recent posts
    select: {
      id: true,
      title: true,
      slug: true,
      // featuredImageUrl: true, // If you have featured images
    },
  });

  return (
    // Consistent page background (e.g., light grey)
    <main className="bg-slate-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50 py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-700 mb-6 leading-tight">
            Find Your Path to Mental Wellness
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            TherapistDB connects you with qualified and compassionate mental health professionals. Start your journey to a healthier mind today.
          </p>
          <form
            action="/therapists" // This will redirect to the therapists search results page
            method="GET"
            className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-lg shadow-lg"
          >
            <label htmlFor="zip-hero" className="sr-only">
              Enter ZIP code
            </label>
            <Search className="text-gray-400 ml-2 hidden sm:block" size={24} />
            <input
              id="zip-hero"
              type="text"
              name="zip" // Important: this query param will be used on /therapists page
              placeholder="Enter Your ZIP Code"
              className="flex-grow appearance-none bg-transparent border-none w-full text-gray-700 py-2 px-2 leading-tight focus:outline-none placeholder-gray-500"
              required
              pattern="\d{5}(-\d{4})?" // Basic 5-digit ZIP validation
              title="Please enter a valid 5-digit ZIP code."
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-md transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Search Therapists
            </button>
          </form>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">
            Explore by Specialty
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {popularCategories.map((category) => (
              <Link
                key={category.slug}
                href={category.href} // Use defined href for correct query params
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-gray-200 hover:border-teal-300"
              >
                <div className="mb-3 p-3 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
                    {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Common Cities Section (Consider if this is more useful than states, or use both) */}
      <section className="bg-gray-100 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">
            Find Therapists in Major Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {commonCities.map((city) => (
              <Link
                key={city.name}
                href={`/therapists?city=${city.query}&state=${city.stateSlug}`} // Example link structure
                className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center text-gray-700 font-medium hover:text-teal-600 border border-gray-200 hover:border-teal-200"
              >
                <MapPin size={20} className="inline-block mr-2 opacity-70" />{city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State Component (passed from here) */}
      <BrowseByState />

      {/* From the Blog Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">
            Insights & Guidance: From Our Blog
          </h2>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  {/* Add post.featuredImageUrl here if you have it */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-teal-600">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && <p className="text-sm text-gray-600 mb-4 flex-grow">{post.excerpt.substring(0,120)}...</p>}
                    <Link href={`/blog/${post.slug}`} className="text-sm text-teal-600 hover:text-teal-700 font-medium self-start">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No blog posts yet. Check back soon!</p>
          )}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block px-8 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-300"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Your existing footer structure is good. I'll add some minor style tweaks. */}
      <footer className="bg-gray-800 text-gray-300 border-t border-gray-700 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-3 text-lg">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-teal-400 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-teal-400 transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-lg">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-teal-400 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-lg">For Therapists</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/for-therapists" className="hover:text-teal-400 transition-colors">List Your Practice</Link></li>
              <li><Link href="/therapist-faq" className="hover:text-teal-400 transition-colors">Therapist FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Professional Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-lg">Connect</h4>
            <p className="text-sm mb-2">Follow us on:</p>
            <ul className="flex space-x-4">
              <li><a href="https://facebook.com/therapistdb" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-teal-400 transition-colors">FB</a></li>
              <li><a href="https://twitter.com/therapistdb" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-teal-400 transition-colors">TW</a></li>
              <li><a href="https://linkedin.com/company/therapistdb" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-teal-400 transition-colors">IN</a></li>
            </ul>
             <p className="text-xs mt-6 text-gray-400">© {new Date().getFullYear()} TherapistDB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}