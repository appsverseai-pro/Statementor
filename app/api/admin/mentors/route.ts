import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { getMentors, upsertMentor, type Mentor } from '@/lib/google-sheets'

function isAuthenticated(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

const mentorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  instrument: z.string().min(2),
  school: z.string().min(2),
  bio: z.string().min(10),
  yearsInAllState: z.number().int().min(1),
  achievements: z.string(),
  teachingAreas: z.string(),
  sessionPrice: z.number().positive(),
  profilePhoto: z.string().optional().default(''),
  availableDays: z.array(z.string()),
  availableTimes: z.array(z.string()),
  email: z.string().email(),
  active: z.boolean().default(true),
})

export async function GET() {
  try {
    const cookieStore = await cookies()
    if (!isAuthenticated(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const mentors = await getMentors()
    return NextResponse.json(mentors)
  } catch (err) {
    console.error('Admin GET /api/admin/mentors error:', err)
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    if (!isAuthenticated(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = mentorSchema.parse(body)

    const mentor: Mentor = {
      id: data.id ?? `mentor-${Date.now()}`,
      name: data.name,
      instrument: data.instrument,
      school: data.school,
      bio: data.bio,
      yearsInAllState: data.yearsInAllState,
      achievements: data.achievements,
      teachingAreas: data.teachingAreas,
      sessionPrice: data.sessionPrice,
      profilePhoto: data.profilePhoto,
      availableDays: data.availableDays,
      availableTimes: data.availableTimes,
      email: data.email,
      active: data.active,
    }

    const result = await upsertMentor(mentor)

    return NextResponse.json(
      { success: true, mentor, persisted: result.persisted, note: result.note },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error('Admin POST /api/admin/mentors error:', err)
    return NextResponse.json({ error: 'Failed to create mentor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    if (!isAuthenticated(cookieStore)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = mentorSchema.parse(body)

    if (!data.id) {
      return NextResponse.json({ error: 'Mentor ID required for update' }, { status: 400 })
    }

    const mentor: Mentor = {
      id: data.id,
      name: data.name,
      instrument: data.instrument,
      school: data.school,
      bio: data.bio,
      yearsInAllState: data.yearsInAllState,
      achievements: data.achievements,
      teachingAreas: data.teachingAreas,
      sessionPrice: data.sessionPrice,
      profilePhoto: data.profilePhoto,
      availableDays: data.availableDays,
      availableTimes: data.availableTimes,
      email: data.email,
      active: data.active,
    }

    const result = await upsertMentor(mentor)

    return NextResponse.json({ success: true, mentor, persisted: result.persisted, note: result.note })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    console.error('Admin PUT /api/admin/mentors error:', err)
    return NextResponse.json({ error: 'Failed to update mentor' }, { status: 500 })
  }
}
