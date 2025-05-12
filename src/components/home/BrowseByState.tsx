'use client'

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois'
  // Add the rest later
]

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export default function BrowseByState() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-lg font-semibold mb-6 text-center text-[#1a2d3e]">
        Browse by State
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {states.map((state) => (
          <a
            key={state}
            href={`/therapists/us/${slugify(state)}`}
            className="block text-center border rounded bg-white py-3 text-[#425F80] text-sm hover:bg-gray-50 transition"
          >
            {state}
          </a>
        ))}
      </div>
    </section>
  )
}
