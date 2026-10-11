/**
 * StateMentor — Auto-confirm bookings from Gmail
 * -----------------------------------------------
 * Watches appsverseai@gmail.com for new "New booking:" alert emails sent by the
 * StateMentor website, reads the student's email + details from the email, and
 * automatically sends the student a confirmation email FROM your Gmail (which can
 * reach any address — no domain verification needed).
 *
 * SETUP (one time, ~3 minutes):
 *  1. Go to https://script.google.com  (signed in as appsverseai@gmail.com)
 *  2. Click "New project", delete the sample code, and paste ALL of this in.
 *  3. Click Save (disk icon). Name it "StateMentor Auto-Confirm".
 *  4. In the left sidebar click "Triggers" (the clock icon) → "Add Trigger":
 *        - Function to run:            autoConfirmBookings
 *        - Deployment:                 Head
 *        - Event source:               Time-driven
 *        - Type of time based trigger: Minutes timer
 *        - Interval:                   Every 5 minutes
 *     Click Save. Approve the permission prompt (it needs to read Gmail + send mail).
 *  5. Done. New bookings are auto-confirmed within ~5 minutes.
 *
 * To test now: click "Run" on the autoConfirmBookings function once.
 */

// ---- Settings you can tweak -------------------------------------------------
var SUBJECT_PREFIX   = 'New booking:';      // matches the website's alert emails
var PROCESSED_LABEL  = 'SM-Confirmed';      // label added so each booking is handled once
var FROM_NAME        = 'StateMentor';       // display name on the confirmation
var LOOKBACK         = 'newer_than:3d';     // only scan recent mail
// ---------------------------------------------------------------------------

function autoConfirmBookings() {
  var label = getOrCreateLabel(PROCESSED_LABEL);
  var query = 'subject:"' + SUBJECT_PREFIX + '" -label:"' + PROCESSED_LABEL + '" ' + LOOKBACK;
  var threads = GmailApp.search(query, 0, 50);

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var msg = messages[j];
      if (msg.getSubject().indexOf(SUBJECT_PREFIX) !== 0) continue;

      var booking = parseBooking(msg);
      if (booking && booking.email) {
        try {
          sendConfirmation(booking);
        } catch (e) {
          Logger.log('Failed to confirm ' + booking.email + ': ' + e);
        }
      }
    }
    thread.addLabel(label);   // mark the whole thread handled
  }
}

function parseBooking(msg) {
  var body = msg.getBody(); // raw HTML, includes the hidden #SMBK...SMBK# marker
  var m = body.match(/#SMBK\|email=([\s\S]*?)\|name=([\s\S]*?)\|mentor=([\s\S]*?)\|when=([\s\S]*?)\|length=([\s\S]*?)\|SMBK#/);
  if (m) {
    return {
      email:  unescapeHtml(m[1]).trim(),
      name:   unescapeHtml(m[2]).trim(),
      mentor: unescapeHtml(m[3]).trim(),
      when:   unescapeHtml(m[4]).trim(),
      length: unescapeHtml(m[5]).trim()
    };
  }
  // Fallback: the alert sets Reply-To to the student's email.
  var replyTo = msg.getReplyTo() || '';
  var emailMatch = replyTo.match(/[^<>\s]+@[^<>\s]+/);
  if (emailMatch) {
    return { email: emailMatch[0], name: '', mentor: '', when: '', length: '' };
  }
  return null;
}

function sendConfirmation(b) {
  var firstName = (b.name || '').split(' ')[0] || 'there';
  var subject = 'Your StateMentor session is confirmed! 🎶';

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">' +
      '<div style="background:#1E1A47;padding:24px;border-radius:12px 12px 0 0;text-align:center;">' +
        '<h1 style="color:#8368D6;margin:0;font-size:24px;">StateMentor</h1>' +
      '</div>' +
      '<div style="border:1px solid #e5e5ef;border-top:none;border-radius:0 0 12px 12px;padding:28px;color:#1E1A47;">' +
        '<h2 style="margin-top:0;">You\'re confirmed, ' + escapeHtmlJs(firstName) + '! 🎉</h2>' +
        '<p style="line-height:1.6;color:#333;">Great news — your mentorship session is confirmed.' +
        (b.mentor ? ' Your mentor <b>' + escapeHtmlJs(b.mentor) + '</b> is looking forward to working with you.' : '') +
        '</p>' +
        (b.when ? '<div style="background:#f3f1fb;border-left:4px solid #8368D6;padding:12px 16px;border-radius:6px;margin:16px 0;">' +
          '<b>When:</b> ' + escapeHtmlJs(b.when) + (b.length ? ' &middot; ' + escapeHtmlJs(b.length) : '') + '</div>' : '') +
        '<p style="line-height:1.6;color:#333;">Your mentor will reach out to you directly with a meeting link and any prep notes. ' +
        'If you have questions in the meantime, just reply to this email.</p>' +
        '<p style="line-height:1.6;color:#333;">See you soon! 🎺</p>' +
        '<p style="color:#888;font-size:13px;margin-top:24px;">— The StateMentor Team</p>' +
      '</div>' +
    '</div>';

  GmailApp.sendEmail(b.email, subject, 'Your StateMentor session is confirmed!', {
    name: FROM_NAME,
    htmlBody: html
  });
  Logger.log('Confirmation sent to ' + b.email);
}

function getOrCreateLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function unescapeHtml(s) {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtmlJs(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
