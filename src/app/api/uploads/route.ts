// src/app/api/uploads/route.ts

// Force Node.js runtime so we can use fs and formidable
export const runtime = 'nodejs'

import { IncomingForm, Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Disable Next’s built-in body parsing so formidable can handle multipart forms
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  try {
    // 1) Ensure the upload directory exists under public
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // 2) Set up formidable to save uploads into our folder
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5 MB
    })

    // 3) Parse the incoming request
    const files: Files = await new Promise((resolve, reject) => {
      form.parse(req as any, (err, _fields, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })

    // 4) Grab the `file` field
    const fileField = Array.isArray(files.file) ? files.file[0] : files.file
    if (!fileField || typeof (fileField as any).filepath !== 'string') {
      console.error('❌ No file uploaded or invalid field:', files)
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // 5) Build the public URL for the saved file
    const filename = path.basename((fileField as any).filepath)
    const url = `/uploads/${filename}`
    console.log('✅ Uploaded file URL:', url)

    // 6) Return JSON to the client
    return NextResponse.json({ url })
  } catch (err: any) {
    // Log the full stack so we can debug
    console.error('❌ Upload handler error stack:', err.stack || err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
