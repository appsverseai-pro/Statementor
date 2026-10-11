import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { resend, EMAIL_FROM, ADMIN_NOTIFY_EMAIL } from '@/lib/resend'

// Admin-only diagnostic: attempts to send a test email and reports exactly what
// Resend returns, so email delivery problems are visible instead of silent.
// Visit /api/admin/email-test while logged into the admin panel.
export async function GET() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized — log in to /admin first' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const keyStatus = !apiKey
    ? 'MISSING'
    : apiKey === 'your_resend_api_key' || apiKey === 'placeholder'
      ? 'PLACEHOLDER'
      : `present (starts with ${apiKey.slice(0, 6)}…)`

  let sendResult: unknown = null
  let sendError: string | null = null

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_NOTIFY_EMAIL,
      subject: 'StateMentor email test ✅',
      html: '<p>This is a test email from your StateMentor site. If you received it, outbound email works.</p>',
    })
    sendResult = data
    if (error) sendError = `${error.name ?? 'error'}: ${error.message ?? JSON.stringify(error)}`
  } catch (err) {
    sendError = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  }

  return NextResponse.json({
    resendApiKey: keyStatus,
    from: EMAIL_FROM,
    to: ADMIN_NOTIFY_EMAIL,
    sendResult,
    sendError,
    hint: sendError
      ? 'Resend rejected the send — the error above says why (often: sending to an address that is not your Resend account owner, or an unverified domain).'
      : 'Send accepted by Resend. Check the inbox (and spam) for "StateMentor email test".',
  })
}
