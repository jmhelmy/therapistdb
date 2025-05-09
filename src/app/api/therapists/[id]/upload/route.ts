// src/app/api/uploads/route.ts

export const runtime = 'nodejs'  // ← must be first line

import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Disable Next’s default body parsing so formidable can handle it
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  // Ensure the uploads folder exists
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // Parse the multipart form
  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true })
  const files = await new Promise<formidable.Files>((resolve, reject) => {
    form.parse(req as any, (err, _fields, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })

  // Grab the file (expect field name “file”)
  const fileField = Array.isArray(files.file) ? files.file[0] : files.file
  if (!fileField || typeof (fileField as any).filepath !== 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Return the public URL
  const filename = path.basename((fileField as any).filepath)
  const url = `/uploads/${filename}`
  return NextResponse.json({ url })
}
