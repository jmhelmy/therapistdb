import { resolveZipToLocation } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const zip = searchParams.get('zip') || ''
  const location = resolveZipToLocation(zip)
  if (!location) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(location)
}
