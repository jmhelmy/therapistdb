// app/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { marked } from 'marked'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })

  if (!post) return {}

  return {
    title: post.title,
    description: post.metaDescription || '',
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) return notFound()

  return (
    <main className="bg-[#f9f9f7] min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a2d3e] mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(post.content || '') }}
        />
      </div>
    </main>
  )
}
