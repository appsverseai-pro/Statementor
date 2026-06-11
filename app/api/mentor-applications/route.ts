import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { resend } from '@/lib/resend'

const applicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  instrument: z.string().min(2).max(60),
  school: z.string().min(2).max(120),
  yearsInAllState: z.coerce.number().int().min(1).max(10),
  why: z.string().min(10).max(2000),
})

const APPLICATIONS_EMAIL = 'appsverseai@gmail.com'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed } = rateLimit(`mentor-app:${ip}`, 5, 60_000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const data = applicationSchema.parse(body)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 'your_resend_api_key') {
      console.log('Mentor application received (RESEND_API_KEY not configured, logging only):', data)
      return NextResponse.json({
        success: true,
        note: 'Email delivery is not configured; application was logged server-side.',
      })
    }

    const { error: sendError } = await resend.emails.send({
      from: 'StateMentor <noreply@statementor.com>',
      to: APPLICATIONS_EMAIL,
      replyTo: data.email,
      subject: `New mentor application: ${data.name} (${data.instrument})`,
      html: `
        <h2>New Mentor Application</h2>
        <table style="border-collapse: collapse;">
          <tr><td style="padding:4px 12px 4px 0;"><b>Name</b></td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Email</b></td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Instrument</b></td><td>${escapeHtml(data.instrument)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>School</b></td><td>${escapeHtml(data.school)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Years in All State</b></td><td>${data.yearsInAllState}</td></tr>
        </table>
        <h3>Why they want to mentor</h3>
        <p>${escapeHtml(data.why)}</p>
      `,
    })

    if (sendError) {
      console.error('Resend error, logging application instead:', sendError, data)
      return NextResponse.json({
        success: true,
        note: 'Email delivery failed; application was logged server-side.',
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please check your application — some fields are missing or invalid.' },
        { status: 400 }
      )
    }
    console.error('Mentor application error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
