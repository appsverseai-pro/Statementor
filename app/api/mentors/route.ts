import { NextRequest, NextResponse } from 'next/server'
import { getActiveMentors, getMentorsByInstrument } from '@/lib/google-sheets'

export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instrument = searchParams.get('instrument')

    let mentors
    if (instrument) {
      mentors = await getMentorsByInstrument(instrument)
    } else {
      mentors = await getActiveMentors()
    }

    return NextResponse.json(mentors)
  } catch (err) {
    console.error('GET /api/mentors error:', err)
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 })
  }
}
