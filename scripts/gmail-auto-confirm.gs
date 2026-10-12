/**
 * StateMentor - Auto-confirm bookings from Gmail
 * Sends each new booking a "we got your request" email from your Gmail.
 *
 * SETUP (one time):
 *  1. script.google.com (signed in as appsverseai@gmail.com) -> New project
 *  2. Paste ALL of this, replacing the sample code. Save.
 *  3. Run the autoConfirmBookings function once to authorize.
 *  4. Triggers (clock icon) -> Add Trigger:
 *        Function: autoConfirmBookings | Time-driven | Minutes timer | Every minute
 *  5. (Optional) To send from statementorca@gmail.com, add it under
 *     Gmail Settings -> Accounts and Import -> "Send mail as" and verify it.
 *     Otherwise set FROM_ADDRESS = '' to send from appsverseai@gmail.com.
 */

// ---- Settings ---------------------------------------------------------------
var SUBJECT_PREFIX   = 'New booking:';
var PROCESSED_LABEL  = 'SM-Confirmed';
var FROM_NAME        = 'StateMentor';
var FROM_ADDRESS     = 'statementorca@gmail.com'; // set to '' to send from the account itself
var LOOKBACK         = 'newer_than:3d';
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
    thread.addLabel(label);
  }
}

function parseBooking(msg) {
  var body = msg.getBody();
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
  var replyTo = msg.getReplyTo() || '';
  var emailMatch = replyTo.match(/[^<>\s]+@[^<>\s]+/);
  if (emailMatch) {
    return { email: emailMatch[0], name: '', mentor: '', when: '', length: '' };
  }
  return null;
}

function sendConfirmation(b) {
  var firstName = (b.name || '').split(' ')[0] || 'there';
  var subject = 'We got your StateMentor booking request!';

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">' +
      '<div style="background:#1E1A47;padding:24px;border-radius:12px 12px 0 0;text-align:center;">' +
        '<h1 style="color:#8368D6;margin:0;font-size:24px;">StateMentor</h1>' +
      '</div>' +
      '<div style="border:1px solid #e5e5ef;border-top:none;border-radius:0 0 12px 12px;padding:28px;color:#1E1A47;">' +
        '<h2 style="margin-top:0;">Thanks, ' + escapeHtmlJs(firstName) + '! What happens next</h2>' +
        '<p style="line-height:1.6;color:#333;">Our mentors are all <b>high schoolers</b>, so we\'ll ' +
        'double-check their availability first. You\'ll hear back <b>within 24 hours</b>.</p>' +
        '<p style="line-height:1.6;color:#333;">Once your session is confirmed, we\'ll send an ' +
        '<b>email invite to your inbox</b> with all the details. Please keep an eye out for it, ' +
        'and check your spam folder just in case!</p>' +
        '<p style="color:#888;font-size:13px;margin-top:24px;">&mdash; The StateMentor Team</p>' +
      '</div>' +
    '</div>';

  var plain = 'Thanks, ' + firstName + '! Here is what happens next:\n\n' +
    'Our mentors are all high schoolers, so we will double-check their availability first. ' +
    'You will hear back within 24 hours.\n\n' +
    'Once your session is confirmed, we will send an email invite to your inbox with all the details. ' +
    'Please keep an eye out for it, and check your spam folder just in case!\n\n-- The StateMentor Team';

  var options = { name: FROM_NAME, htmlBody: html };
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
