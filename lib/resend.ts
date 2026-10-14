import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

// Sender address. Defaults to Resend's shared test sender, which works
// immediately without verifying a domain (it can deliver to the Resend
// account owner's address). Once you verify your own domain in Resend,
// set EMAIL_FROM (e.g. "StateMentor <noreply@yourdomain.com>") to send to
// any recipient.
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? 'StateMentor <onboarding@resend.dev>'

// Where booking alerts are sent so the admin can manually confirm each session.
// Defaults to the Resend account owner's address, which delivers even before a
// custom domain is verified.
export const ADMIN_NOTIFY_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL ?? 'appsverseai@gmail.com'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Always render session times in Pacific time (Pleasanton) with the zone shown,
// so a 6 PM selection doesn't display as 1 AM UTC on the server.
function formatSessionDate(sessionDate: string): string {
  try {
    return new Date(sessionDate).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Los_Angeles',
      timeZoneName: 'short',
    })
  } catch {
    // Never let date formatting break an email send.
    try {
      return new Date(sessionDate).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    } catch {
      return sessionDate
    }
  }
}

// Sends the admin a summary of a new booking so they can reach out and confirm
// the session manually. Best-effort — never throws.
export async function sendAdminBookingAlert({
  mentorName,
  mentorEmail,
  studentName,
  studentEmail,
  studentGrade,
  studentInstrument,
  sessionDate,
  sessionLength,
  sessionGoals,
}: {
  mentorName: string
  mentorEmail: string
  studentName: string
  studentEmail: string
  studentGrade?: string
  studentInstrument: string
  sessionDate: string
  sessionLength: number
  sessionGoals?: string
}) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_NOTIFY_EMAIL,
      replyTo: studentEmail,
      subject: `New booking: ${studentName} → ${mentorName}`,
      html: `
        <h2>New StateMentor Booking</h2>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 12px 4px 0;"><b>Mentor</b></td><td>${escapeHtml(mentorName)} (${escapeHtml(mentorEmail)})</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Student</b></td><td>${escapeHtml(studentName)}</td></tr>
          ${studentGrade ? `<tr><td style="padding:4px 12px 4px 0;"><b>Grade</b></td><td>${escapeHtml(studentGrade)}</td></tr>` : ''}
          <tr><td style="padding:4px 12px 4px 0;"><b>Student email</b></td><td>${escapeHtml(studentEmail)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Instrument</b></td><td>${escapeHtml(studentInstrument)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Date & time</b></td><td>${formatSessionDate(sessionDate)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><b>Length</b></td><td>${sessionLength} minutes</td></tr>
        </table>
        ${sessionGoals ? `<h3>Goals</h3><p>${escapeHtml(sessionGoals)}</p>` : ''}
        <p style="color:#666;font-size:13px;">Reply to this email to reach the student directly, and loop in the mentor to confirm the session.</p>
        <div style="color:#ffffff;font-size:1px;line-height:1px;">#SMBK|email=${escapeHtml(studentEmail)}|name=${escapeHtml(studentName)}|mentor=${escapeHtml(mentorName)}|when=${formatSessionDate(sessionDate)}|length=${sessionLength}min|SMBK#</div>
      `,
    })
  } catch (err) {
    console.error('Failed to send admin booking alert:', err)
  }
}

export async function sendBookingConfirmation({
  studentEmail,
  studentName,
  mentorName,
  instrument,
  sessionDate,
  sessionLength,
  sessionGoals,
}: {
  studentEmail: string
  studentName: string
  mentorName: string
  instrument: string
  sessionDate: string
  sessionLength: number
  sessionGoals?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: studentEmail,
      subject: `Booking Confirmed: Session with ${mentorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F4ED; padding: 40px 20px;">
          <div style="background-color: #1B2A4A; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #C9973A; margin: 0; font-size: 28px;">StateMentor</h1>
            <p style="color: #F8F4ED; margin: 8px 0 0;">Music Mentorship Platform</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0d9cf;">
            <h2 style="color: #1B2A4A; margin-top: 0;">Your Session is Confirmed!</h2>

            <p style="color: #444;">Hi ${studentName},</p>
            <p style="color: #444;">Great news! Your mentorship session has been booked successfully.</p>

            <div style="background-color: #F8F4ED; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #C9973A;">
              <h3 style="color: #1B2A4A; margin-top: 0;">Session Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 40%;">Mentor:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${mentorName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Instrument:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${instrument}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Date & Time:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${formatSessionDate(sessionDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Duration:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${sessionLength} minutes</td>
                </tr>
                ${sessionGoals ? `
                <tr>
                  <td style="padding: 6px 0; color: #666; vertical-align: top;">Goals:</td>
                  <td style="padding: 6px 0; color: #1B2A4A;">${sessionGoals}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <p style="color: #444;">Your mentor will reach out to you soon with session details and a meeting link.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}" style="background-color: #C9973A; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Visit StateMentor</a>
            </div>

            <p style="color: #888; font-size: 14px; margin-bottom: 0;">If you have any questions, reply to this email or contact us at statementorca@gmail.com</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }
}

export async function sendMentorNotification({
  mentorEmail,
  mentorName,
  studentName,
  studentInstrument,
  sessionDate,
  sessionLength,
  sessionGoals,
}: {
  mentorEmail: string
  mentorName: string
  studentName: string
  studentInstrument: string
  sessionDate: string
  sessionLength: number
  sessionGoals?: string
}) {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: mentorEmail,
      subject: `New Session Booking from ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F4ED; padding: 40px 20px;">
          <div style="background-color: #1B2A4A; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #C9973A; margin: 0; font-size: 28px;">StateMentor</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0d9cf;">
            <h2 style="color: #1B2A4A; margin-top: 0;">New Session Booked!</h2>

            <p style="color: #444;">Hi ${mentorName},</p>
            <p style="color: #444;">A student has booked a mentorship session with you.</p>

            <div style="background-color: #F8F4ED; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #7C1D2D;">
              <h3 style="color: #1B2A4A; margin-top: 0;">Session Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #666; width: 40%;">Student:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Instrument:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${studentInstrument}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Date & Time:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${formatSessionDate(sessionDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Duration:</td>
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${sessionLength} minutes</td>
                </tr>
                ${sessionGoals ? `
                <tr>
                  <td style="padding: 6px 0; color: #666; vertical-align: top;">Goals:</td>
                  <td style="padding: 6px 0; color: #1B2A4A;">${sessionGoals}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <p style="color: #444;">Please reach out to your student to confirm the session and share meeting details.</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send mentor notification email:', err)
  }
}
