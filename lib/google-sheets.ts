import { google } from 'googleapis'
import { getServiceClient } from '@/lib/supabase/admin'

export type Mentor = {
  id: string
  name: string
  instrument: string
  school: string
  bio: string
  yearsInAllState: number
  achievements: string
  teachingAreas: string
  sessionPrice: number
  profilePhoto: string
  availableDays: string[]
  availableTimes: string[]
  email: string
  active: boolean
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    instrument: 'Violin',
    school: 'Lincoln High School',
    bio: 'Three-time All-State violinist with a passion for helping students reach their full potential. I specialize in audition preparation and technique refinement.',
    yearsInAllState: 3,
    achievements: 'All-State Orchestra 2021, 2022, 2023; Youth Symphony Concertmaster',
    teachingAreas: 'Audition preparation, bow technique, sight-reading',
    sessionPrice: 60,
    profilePhoto: '',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableTimes: ['3:00 PM', '4:00 PM', '5:00 PM'],
    email: 'sarah.chen@example.com',
    active: true,
  },
  {
    id: '2',
    name: 'Marcus Williams',
    instrument: 'Trumpet',
    school: 'Roosevelt Academy',
    bio: 'All-State Band trumpet player and jazz enthusiast. I help students develop strong fundamentals while making music fun and engaging.',
    yearsInAllState: 2,
    achievements: 'All-State Band 2022, 2023; Regional Jazz Soloist Award',
    teachingAreas: 'Tone production, range building, jazz improv',
    sessionPrice: 55,
    profilePhoto: '',
    availableDays: ['Tuesday', 'Thursday', 'Sunday'],
    availableTimes: ['4:00 PM', '5:00 PM', '6:00 PM'],
    email: 'marcus.williams@example.com',
    active: true,
  },
  {
    id: '3',
    name: 'Priya Patel',
    instrument: 'Flute',
    school: 'Westbrook High',
    bio: 'Passionate flutist who has competed at state and national levels. I focus on breath support, tone clarity, and musical expression.',
    yearsInAllState: 4,
    achievements: 'All-State Orchestra 2020-2023; National Flute Association Young Artist',
    teachingAreas: 'Breath support, tone, intonation, expression',
    sessionPrice: 65,
    profilePhoto: '',
    availableDays: ['Monday', 'Friday', 'Saturday'],
    availableTimes: ['2:00 PM', '3:00 PM', '4:00 PM'],
    email: 'priya.patel@example.com',
    active: true,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    instrument: 'Clarinet',
    school: 'Eastside High',
    bio: 'Dedicated clarinet student with experience in classical and jazz styles. Helped over 10 students successfully make All-State.',
    yearsInAllState: 2,
    achievements: 'All-State Band 2022, 2023; District Solo & Ensemble Superior Rating',
    teachingAreas: 'Scale fluency, reed selection, tone quality',
    sessionPrice: 50,
    profilePhoto: '',
    availableDays: ['Wednesday', 'Thursday', 'Saturday'],
    availableTimes: ['3:30 PM', '5:00 PM', '6:00 PM'],
    email: 'james.rodriguez@example.com',
    active: true,
  },
  {
    id: '5',
    name: 'Emma Thompson',
    instrument: 'Cello',
    school: 'Northview Academy',
    bio: 'Cellist with deep orchestral experience. I work with students on shifting, vibrato, and orchestral excerpt preparation.',
    yearsInAllState: 3,
    achievements: 'All-State Orchestra 2021-2023; Youth Philharmonic Principal Cellist',
    teachingAreas: 'Shifting, vibrato, bow distribution, orchestral excerpts',
    sessionPrice: 70,
    profilePhoto: '',
    availableDays: ['Monday', 'Tuesday', 'Sunday'],
    availableTimes: ['4:00 PM', '5:00 PM', '6:00 PM'],
    email: 'emma.thompson@example.com',
    active: true,
  },
  {
    id: '6',
    name: 'David Kim',
    instrument: 'Piano',
    school: 'Central Music Prep',
    bio: 'Versatile pianist with classical training and strong theory background. I help students with repertoire, technique, and music theory.',
    yearsInAllState: 2,
    achievements: 'All-State Choir Accompanist 2022, 2023; State Piano Competition Finalist',
    teachingAreas: 'Technique, repertoire selection, music theory, sight-reading',
    sessionPrice: 75,
    profilePhoto: '',
    availableDays: ['Tuesday', 'Friday', 'Saturday'],
    availableTimes: ['3:00 PM', '4:00 PM', '5:00 PM'],
    email: 'david.kim@example.com',
    active: true,
  },
  {
    id: '7',
    name: 'Aisha Johnson',
    instrument: 'Voice',
    school: 'Harmony Arts High',
    bio: 'Soprano with All-State Choir experience. I specialize in vocal technique, diction, and performance anxiety management.',
    yearsInAllState: 3,
    achievements: 'All-State Choir 2021-2023; Regional Vocal Competition First Place',
    teachingAreas: 'Vocal technique, diction, breath support, stage presence',
    sessionPrice: 60,
    profilePhoto: '',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableTimes: ['2:00 PM', '3:00 PM', '4:00 PM'],
    email: 'aisha.johnson@example.com',
    active: true,
  },
  {
    id: '8',
    name: 'Tyler Nguyen',
    instrument: 'Saxophone',
    school: 'South Ridge High',
    bio: 'Alto sax player with strong classical and jazz background. I focus on tone production, altissimo range, and audition etiquette.',
    yearsInAllState: 2,
    achievements: 'All-State Jazz Band 2022, 2023; Downbeat Student Music Award',
    teachingAreas: 'Tone production, altissimo, jazz articulation, audition prep',
    sessionPrice: 55,
    profilePhoto: '',
    availableDays: ['Thursday', 'Friday', 'Sunday'],
    availableTimes: ['4:00 PM', '5:00 PM', '6:00 PM'],
    email: 'tyler.nguyen@example.com',
    active: true,
  },
]

// In-memory fallback store used when Google Sheets is not configured.
// Mentors added via the admin UI are kept here for the lifetime of the
// server process so the admin functions still work in development.
const inMemoryMentors = new Map<string, Mentor>()

// ---------------------------------------------------------------------------
// Supabase persistence layer (used when Google Sheets isn't configured).
// Mentors are stored in a `mentors` table so admin add/edit changes survive
// server restarts and serverless cold starts.
// ---------------------------------------------------------------------------

type MentorRow = {
  id: string
  name: string
  instrument: string
  school: string
  bio: string
  years_in_all_state: number
  achievements: string
  teaching_areas: string
  session_price: number
  profile_photo: string
  available_days: string[] | null
  available_times: string[] | null
  email: string
  active: boolean
}

function rowToMentor(row: MentorRow): Mentor {
  return {
    id: row.id,
    name: row.name,
    instrument: row.instrument,
    school: row.school,
    bio: row.bio,
    yearsInAllState: row.years_in_all_state,
    achievements: row.achievements ?? '',
    teachingAreas: row.teaching_areas ?? '',
    sessionPrice: Number(row.session_price),
    profilePhoto: row.profile_photo ?? '',
    availableDays: row.available_days ?? [],
    availableTimes: row.available_times ?? [],
    email: row.email,
    active: row.active,
  }
}

function mentorToRow(mentor: Mentor): MentorRow {
  return {
    id: mentor.id,
    name: mentor.name,
    instrument: mentor.instrument,
    school: mentor.school,
    bio: mentor.bio,
    years_in_all_state: mentor.yearsInAllState,
    achievements: mentor.achievements,
    teaching_areas: mentor.teachingAreas,
    session_price: mentor.sessionPrice,
    profile_photo: mentor.profilePhoto,
    available_days: mentor.availableDays,
    available_times: mentor.availableTimes,
    email: mentor.email,
    active: mentor.active,
  }
}

async function getMentorsFromSupabase(): Promise<Mentor[] | null> {
  const supabase = getServiceClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('mentors')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    // Table likely doesn't exist yet — fall back to mock data so the site
    // still renders until the schema is applied.
    console.error('Supabase mentors fetch failed, falling back to mock:', error.message)
    return null
  }

  return (data as MentorRow[]).map(rowToMentor)
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !key || email === 'your_service_account_email') {
    return null
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function parseRow(row: string[]): Mentor | null {
  if (!row[0]) return null
  try {
    return {
      id: row[0] ?? '',
      name: row[1] ?? '',
      instrument: row[2] ?? '',
      school: row[3] ?? '',
      bio: row[4] ?? '',
      yearsInAllState: parseInt(row[5] ?? '0', 10) || 0,
      achievements: row[6] ?? '',
      teachingAreas: row[7] ?? '',
      sessionPrice: parseFloat(row[8] ?? '0') || 0,
      profilePhoto: row[9] ?? '',
      availableDays: row[10] ? row[10].split(',').map((s) => s.trim()) : [],
      availableTimes: row[11] ? row[11].split(',').map((s) => s.trim()) : [],
      email: row[12] ?? '',
      active: (row[13] ?? 'true').toLowerCase() === 'true',
    }
  } catch {
    return null
  }
}

export async function getMentors(): Promise<Mentor[]> {
  const auth = getAuth()

  if (!auth) {
    // Prefer Supabase persistence when configured.
    const fromSupabase = await getMentorsFromSupabase()
    if (fromSupabase !== null) return fromSupabase

    // Otherwise return mock data (plus any in-memory additions).
    return mergeWithInMemory(MOCK_MENTORS)
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth })
    const sheetId = process.env.GOOGLE_SHEETS_ID

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Mentors!A2:N', // Skip header row
    })

    const rows = response.data.values ?? []
    const mentors: Mentor[] = []

    for (const row of rows) {
      const mentor = parseRow(row as string[])
      if (mentor) mentors.push(mentor)
    }

    return mentors
  } catch (err) {
    console.error('Google Sheets error, falling back to mock data:', err)
    return mergeWithInMemory(MOCK_MENTORS)
  }
}

export async function getMentorById(id: string): Promise<Mentor | null> {
  const mentors = await getMentors()
  return mentors.find((m) => m.id === id) ?? null
}

export async function getActiveMentors(): Promise<Mentor[]> {
  const mentors = await getMentors()
  return mentors.filter((m) => m.active)
}

export async function getMentorsByInstrument(instrument: string): Promise<Mentor[]> {
  const mentors = await getActiveMentors()
  return mentors.filter(
    (m) => m.instrument.toLowerCase() === instrument.toLowerCase()
  )
}

export async function getUniqueInstruments(): Promise<{ instrument: string; count: number }[]> {
  const mentors = await getActiveMentors()
  const map = new Map<string, number>()

  for (const mentor of mentors) {
    const key = mentor.instrument
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  return Array.from(map.entries())
    .map(([instrument, count]) => ({ instrument, count }))
    .sort((a, b) => a.instrument.localeCompare(b.instrument))
}

function mergeWithInMemory(base: Mentor[]): Mentor[] {
  if (inMemoryMentors.size === 0) return base
  const result = base.map((m) => inMemoryMentors.get(m.id) ?? m)
  for (const mentor of inMemoryMentors.values()) {
    if (!base.some((m) => m.id === mentor.id)) result.push(mentor)
  }
  return result
}

export type UpsertResult = { persisted: boolean; note?: string }

export async function upsertMentor(mentor: Mentor): Promise<UpsertResult> {
  const auth = getAuth()
  if (!auth) {
    // Prefer Supabase persistence when configured.
    const supabase = getServiceClient()
    if (supabase) {
      const { error } = await supabase
        .from('mentors')
        .upsert(mentorToRow(mentor), { onConflict: 'id' })

      if (error) {
        console.error('Supabase mentor upsert failed:', error.message)
        // Keep an in-memory copy so the change is visible this session, and
        // surface a clear note (usually means the table isn't created yet).
        inMemoryMentors.set(mentor.id, mentor)
        return {
          persisted: false,
          note: `Could not save to the database (${error.message}). Make sure the mentors table exists.`,
        }
      }

      return { persisted: true }
    }

    inMemoryMentors.set(mentor.id, mentor)
    console.log('Google Sheets not configured — mentor stored in memory:', mentor.id)
    return {
      persisted: false,
      note: 'Storage is not configured. Mentor saved in-memory only (will reset on server restart).',
    }
  }

  const sheets = google.sheets({ version: 'v4', auth })
  const sheetId = process.env.GOOGLE_SHEETS_ID

  // Get all rows to find existing
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Mentors!A2:N',
  })

  const rows = response.data.values ?? []
  const rowIndex = rows.findIndex((r) => r[0] === mentor.id)

  const values = [
    [
      mentor.id,
      mentor.name,
      mentor.instrument,
      mentor.school,
      mentor.bio,
      mentor.yearsInAllState,
      mentor.achievements,
      mentor.teachingAreas,
      mentor.sessionPrice,
      mentor.profilePhoto,
      mentor.availableDays.join(', '),
      mentor.availableTimes.join(', '),
      mentor.email,
      mentor.active,
    ],
  ]

  if (rowIndex === -1) {
    // Append
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Mentors!A2:N',
      valueInputOption: 'RAW',
      requestBody: { values },
    })
    return { persisted: true }
  } else {
    // Update existing row
    const sheetRow = rowIndex + 2 // +2 for header + 1-indexed
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Mentors!A${sheetRow}:N${sheetRow}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    })
    return { persisted: true }
  }
}
