// src/app/api/therapists/[id]/upload/route.ts
import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || !params.id) {
    return NextResponse.json({ error: 'Missing file or ID' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${params.id}-${Date.now()}-${file.name}`
  const filePath = path.join(process.cwd(), 'public/uploads', filename)

  await writeFile(filePath, buffer)

  const url = `/uploads/${filename}`
  return NextResponse.json({ url })
}
