// app/worksheets/[slug]/page.tsx
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import html from 'remark-html'
import Image from 'next/image'

interface WorksheetData {
  title: string
  slug: string
  image: string
  pdfUrl: string
  description: string
  contentHtml: string
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content', 'worksheets')
  const files = await fs.readdir(dir)
  return files.map((file) => ({ slug: file.replace(/\.md$/, '') }))
}

export default async function WorksheetPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content', 'worksheets', `${params.slug}.md`)
  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const processedContent = await remark().use(html).process(content)
    const contentHtml = processedContent.toString()

    const worksheet: WorksheetData = {
      title: data.title,
      slug: data.slug,
      image: data.image,
      pdfUrl: data.pdfUrl,
      description: data.description,
      contentHtml,
    }

    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{worksheet.title}</h1>
            <a href={worksheet.pdfUrl} className="text-sky-600 underline mb-2 block">
              PDF Download
            </a>
            <p className="text-xl font-semibold mt-4 mb-2">DIGITAL Worksheet</p>
            <ul className="text-sky-600 space-y-1">
              <li>Use for self-journaling</li>
              <li>Give worksheet to my client</li>
            </ul>
          </div>
          <div className="w-full md:w-64 h-auto">
            <Image
              src={`/img/worksheet/${worksheet.image}`}
              alt={worksheet.title}
              width={400}
              height={300}
              className="rounded-xl shadow-md"
            />
          </div>
        </div>

        <section className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: worksheet.contentHtml }} />
        </section>
      </main>
    )
  } catch (e) {
    return notFound()
  }
}