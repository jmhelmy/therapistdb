// app/api/worksheets/upload/route.ts
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const markdown = formData.get('markdown') as string
  const image = formData.get('image') as File | null
  const pdf = formData.get('pdf') as File | null

  if (!title || !slug || !markdown) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 1. Save image to /public/img/worksheet/[slug].[ext]
  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer())
    const ext = image.name.split('.').pop()
    const imagePath = path.join(process.cwd(), 'public', 'img', 'worksheet', `${slug}.${ext}`)
    await mkdir(path.dirname(imagePath), { recursive: true })
    await writeFile(imagePath, buffer)
  }

  // 2. Save PDF to /public/pdfs/[slug].pdf
  if (pdf && pdf.size > 0) {
    const buffer = Buffer.from(await pdf.arrayBuffer())
    const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${slug}.pdf`)
    await mkdir(path.dirname(pdfPath), { recursive: true })
    await writeFile(pdfPath, buffer)
  }

  // 3. Save Markdown content to /content/worksheets/[slug].md
  const mdFrontmatter = `---\ntitle: ${title}\nslug: ${slug}\ndescription: ${description}\nimage: ${slug}.png\npdfUrl: /pdfs/${slug}.pdf\n---\n\n${markdown}`

  const mdDir = path.join(process.cwd(), 'content', 'worksheets')
  await mkdir(mdDir, { recursive: true })
  const mdPath = path.join(mdDir, `${slug}.md`)
  await writeFile(mdPath, mdFrontmatter)

  return NextResponse.json({ success: true })
}
