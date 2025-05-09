import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth' // adjust path to your actual auth config

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/build-profile')
  }

  return (
    <main className="bg-[#f9f9f7] min-h-screen">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-[#1a2d3e] mb-8">
          Find a mental health professional
        </h1>

        <form
          action="/therapists"
          method="GET"
          className="max-w-xl mx-auto flex flex-col gap-4"
        >
          <input
            type="text"
            name="zip"
            placeholder="Enter zip code"
            className="border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="bg-[#009688] hover:bg-[#00796B] text-white py-2 rounded-md font-medium"
          >
            Search
          </button>
        </form>
      </section>

      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold mb-6 text-center text-[#1a2d3e]">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-md shadow-sm p-4 flex items-center justify-center text-sm text-[#425F80] text-center h-24"
            >
              {idx === 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-teal-600 text-xl">👥</span>
                  <span>Couple's therapists</span>
                </div>
              ) : (
                'Christian therapists'
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Common Cities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold mb-6 text-center text-[#1a2d3e]">
          Common Cities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            'Los Angeles', 'New York', 'San Diego',
            'dfdfd', 'dfdfd', 'dfdfd', 'dfdfd', 'dfdfd', 'dfdfd', 'dfdfd'
          ].map((city, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-md shadow-sm p-4 flex items-center justify-center text-sm text-[#425F80] text-center h-24"
            >
              {idx === 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-teal-600 text-xl">👥</span>
                  <span>{city}</span>
                </div>
              ) : (
                city
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm text-[#425F80]">
          <div>
            <p className="mb-2 font-semibold">General information</p>
            <ul>
              <li>Community Rules</li>
              <li>Terms</li>
              <li>Sales Solutions</li>
              <li>Security Center</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold">Special abilities</p>
            <ul>
              <li>Career</li>
              <li>Advertising Preferences</li>
              <li>Mobile applications</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold">Hiring Solutions</p>
            <ul>
              <li>Marketing Solutions</li>
              <li>Advertising</li>
              <li>Small business</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span>❓</span>
              <span>Any questions? Visit the Help Center.</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚙️</span>
              <span>Account settings and privacy in settings.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
