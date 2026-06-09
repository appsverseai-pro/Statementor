import { NextResponse } from 'next/server'
import { getUniqueInstruments } from '@/lib/google-sheets'

export const revalidate = 60

export async function GET() {
  try {
    const instruments = await getUniqueInstruments()
    return NextResponse.json(instruments)
  } catch (err) {
    console.error('GET /api/instruments error:', err)
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 })
  }
}
