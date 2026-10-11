/**
 * StateMentor — Auto-confirm bookings from Gmail
 * -----------------------------------------------
 * Watches appsverseai@gmail.com for new "New booking:" alert emails sent by the
 * StateMentor website, reads the student's email + details from the email, and
 * automatically sends the student a confirmation email FROM your Gmail (which can
 * reach any address — no domain verification needed).
 *
 * SETUP (one time, ~5 minutes):
 *  1. Go to https://script.google.com  (signed in as appsverseai@gmail.com)
 *  2. Click "New project", delete the sample code, and paste ALL of this in.
 *  3. Click Save (disk icon). Name it "StateMentor Auto-Confirm".
 *  4. In the left sidebar click "Triggers" (the clock icon) -> "Add Trigger":
 *        - Function to run:            autoConfirmBookings
 *        - Deployment:                 Head
 *        - Event source:               Time-driven
 *        - Type of time based trigger: Minutes timer
 *        - Interval:                   Every 5 minutes
 *     Click Save. Approve the permission prompt (it needs to read Gmail + send mail).
 *  5. Done. New bookings get an auto "we got your request" email within ~5 minutes.
 *
 *  6. (Optional) To send FROM statementorca@gmail.com instead of appsverseai@gmail.com:
 *        In appsverseai Gmail -> Settings (gear) -> See all settings ->
 *        "Accounts and Import" -> "Send mail as" -> "Add another email address" ->
 *        enter statementorca@gmail.com -> verify via the link Google emails to it.
 *     Once verified, this script's FROM_ADDRESS setting will work. If you skip
 *     this, set FROM_ADDRESS = '' below and emails send from appsverseai@gmail.com.
 *
 * To test now: click "Run" on the autoConfirmBookings function once.
 */

// ---- Settings you can tweak -------------------------------------------------
var SUBJECT_PREFIX   = 'New booking:';            // matches the website's alert emails
var PROCESSED_LABEL  = 'SM-Confirmed';            // label added so each booking is handled once
var FROM_NAME        = 'StateMentor';             // display name on the confirmation
var FROM_ADDRESS     = 'statementorca@gmail.com'; // must be a "Send mail as" alias on this account (see setup step 6)
var LOOKBACK         = 'newer_than:3d';           // only scan recent mail
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
  var subject = 'We got your StateMentor booking request! 🎶';

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">' +
      '<div style="background:#1E1A47;padding:24px;border-radius:12px 12px 0 0;text-align:center;">' +
        '<h1 style="color:#8368D6;margin:0;font-size:24px;">StateMentor</h1>' +
      '</div>' +
      '<div style="border:1px solid #e5e5ef;border-top:none;border-radius:0 0 12px 12px;padding:28px;color:#1E1A47;">' +
        '<h2 style="margin-top:0;">Thanks, ' + escapeHtmlJs(firstName) + '! 📬 What happens next</h2>' +
        '<p style="line-height:1.6;color:#333;">Our mentors are all <b>high schoolers</b>, so we\'ll ' +
        'double-check their availability first. You\'ll hear back <b>within 24 hours</b>.</p>' +
        '<p style="line-height:1.6;color:#333;">Once your session is confirmed, we\'ll send an ' +
        '<b>email invite to your inbox</b> with all the details. Please keep an eye out for it — ' +
        'and check your spam folder just in case! 🎶</p>' +
        '<p style="color:#888;font-size:13px;margin-top:24px;">— The StateMentor Team</p>' +
      '</div>' +
    '</div>';

  var plain = 'Thanks, ' + firstName + '! Here\'s what happens next:\n\n' +
    'Our mentors are all high schoolers, so we\'ll double-check their availability first. ' +
    'You\'ll hear back within 24 hours.\n\n' +
    'Once your session is confirmed, we\'ll send an email invite to your inbox with all the details. ' +
    'Please keep an eye out for it — and check your spam folder just in case!\n\n— The StateMentor Team';

  var options = { name: FROM_NAME, htmlBody: html };
  // Send from the alias if it's set up on this account; otherwise Gmail falls back
  // to the account's own address automatically.
  if (FROM_ADDRESS) options.from = FROM_ADDRESS;

  GmailApp.sendEmail(b.email, subject, plain, options);
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
