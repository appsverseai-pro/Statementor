import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')

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
      from: 'StateMentor <noreply@statementor.com>',
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
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${new Date(sessionDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
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

            <p style="color: #888; font-size: 14px; margin-bottom: 0;">If you have any questions, reply to this email or contact us at support@statementor.com</p>
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
      from: 'StateMentor <noreply@statementor.com>',
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
                  <td style="padding: 6px 0; color: #1B2A4A; font-weight: bold;">${new Date(sessionDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
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
