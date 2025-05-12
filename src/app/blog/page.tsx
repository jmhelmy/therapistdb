// app/blog/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="bg-[#f9f9f7] min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-3xl font-semibold text-[#1a2d3e] mb-2">
            Mental Health Blog
          </h1>
          <p className="text-[#425F80] text-sm">
            Explore articles on mental wellness, therapy, and emotional growth.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-[#1a2d3e] mb-2">
                  {post.title}
                </h2>
                {post.metaDescription && (
                  <p className="text-sm text-[#425F80] line-clamp-3">
                    {post.metaDescription}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
