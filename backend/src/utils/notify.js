// Notification helpers.
// - Admin alerts on new bookings / contact messages (console).
// - Guest confirmation email (branded HTML) + WhatsApp message when a booking is accepted.
//
// Email uses Nodemailer when SMTP_* env vars are set; WhatsApp uses Twilio when
// TWILIO_* env vars are set. Both degrade gracefully (log only) when not configured,
// so the app runs fine out of the box.

const BUSINESS = process.env.BUSINESS_NAME || 'Sawta Guest House'
const BUSINESS_PHONE = process.env.BUSINESS_PHONE || '+91 98765 43210'
const BUSINESS_EMAIL = process.env.MAIL_FROM_ADDRESS || 'stay@sawtaguesthouse.com'
const BRAND_NAVY = '#0F172A'
const BRAND_GOLD = '#D4AF37'

/* ----------------------------- small helpers ----------------------------- */

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date)) return String(d).slice(0, 10)
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  if (isNaN(a) || isNaN(b)) return 1
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 1
}

function durationLabel(nights) {
  return nights + ' night' + (nights > 1 ? 's' : '')
}

function normalizePhone(mobile) {
  let d = String(mobile || '').replace(/\D/g, '')
  if (d.length === 10) d = '91' + d // default India country code
  return d
}

function waLink(mobile, text) {
  return 'https://wa.me/' + normalizePhone(mobile) + '?text=' + encodeURIComponent(text)
}

/* --------------------------- email HTML template -------------------------- */

export function bookingConfirmationHtml(booking, opts = {}) {
  const nights = opts.nights || nightsBetween(booking.checkIn, booking.checkOut)
  const duration = opts.durationText || durationLabel(nights)
  const row = (label, value) =>
    '<tr>' +
    '<td style="padding:10px 0;color:#64748b;font-size:13px;">' + label + '</td>' +
    '<td style="padding:10px 0;color:#0F172A;font-size:14px;font-weight:600;text-align:right;">' + (value || '—') + '</td>' +
    '</tr>'

  return [
    '<!doctype html><html><body style="margin:0;background:#f5efe6;font-family:Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe6;padding:24px 0;"><tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,.08);">',

    // Header
    '<tr><td style="background:' + BRAND_NAVY + ';padding:32px 36px;text-align:center;">',
    '<div style="color:' + BRAND_GOLD + ';font-size:13px;letter-spacing:3px;text-transform:uppercase;">' + BUSINESS + '</div>',
    '<div style="color:#ffffff;font-size:24px;font-weight:700;margin-top:6px;">Booking Confirmed Instantly</div>',
    '</td></tr>',

    // Success badge
    '<tr><td style="padding:32px 36px 8px;text-align:center;">',
    '<div style="display:inline-block;width:64px;height:64px;line-height:64px;border-radius:50%;background:#ecfdf5;color:#16a34a;font-size:30px;">✓</div>',
    '<h1 style="font-size:20px;color:#0F172A;margin:18px 0 6px;">Hi ' + (booking.name || 'Guest') + ', your room is booked!</h1>',
    '<p style="font-size:14px;color:#64748b;margin:0;line-height:1.6;">Good news — your <strong>' + (booking.roomType || 'room') + '</strong> at ' + BUSINESS + ' is <strong>confirmed instantly</strong> for <strong>' + duration + '</strong>. No further approval is needed. We look forward to hosting you!</p>',
    '</td></tr>',

    // Details card
    '<tr><td style="padding:16px 36px 8px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;border:1px solid #ede4d3;border-radius:12px;padding:8px 18px;">',
    row('Room', booking.roomType),
    row('Check-in', fmtDate(booking.checkIn)),
    row('Check-out', fmtDate(booking.checkOut)),
    row('Duration', duration),
    row('Guests', booking.guests),
    row('Booking ID', booking._id ? String(booking._id).slice(-8).toUpperCase() : '—'),
    '</table>',
    '</td></tr>',

    // CTA
    '<tr><td style="padding:24px 36px 8px;text-align:center;">',
    '<a href="tel:' + BUSINESS_PHONE.replace(/\s/g, '') + '" style="display:inline-block;background:' + BRAND_GOLD + ';color:#0F172A;font-weight:700;font-size:14px;text-decoration:none;padding:13px 28px;border-radius:10px;">Call Us: ' + BUSINESS_PHONE + '</a>',
    '</td></tr>',

    // Footer
    '<tr><td style="padding:24px 36px 32px;text-align:center;border-top:1px solid #f1f5f9;margin-top:16px;">',
    '<p style="font-size:12px;color:#94a3b8;margin:6px 0;line-height:1.6;">Need to change your booking? Reply to this email or call us.</p>',
    '<p style="font-size:12px;color:#94a3b8;margin:6px 0;">' + BUSINESS + ' · ' + BUSINESS_EMAIL + '</p>',
    '</td></tr>',

    '</table></td></tr></table></body></html>',
  ].join('')
}

/* ------------------------------- transports ------------------------------- */

// RFC 2047 encoded-word so emoji / non-ASCII subjects render correctly.
function encodeSubject(s) {
  return '=?UTF-8?B?' + Buffer.from(String(s), 'utf8').toString('base64') + '?='
}

// Build a base64url-encoded RFC 822 MIME message for the Gmail API.
function buildRawMessage({ from, to, subject, html }) {
  const msg = [
    'From: ' + from,
    'To: ' + to,
    'Subject: ' + encodeSubject(subject),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 7bit',
    '',
    html,
  ].join('\r\n')
  return Buffer.from(msg)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Send through the official Gmail API using OAuth2 (refresh token).
async function sendViaGmailApi({ to, subject, html, from }) {
  const { google } = await import('googleapis')
  const oauth2 = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI || 'https://developers.google.com/oauthplayground'
  )
  oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  const gmail = google.gmail({ version: 'v1', auth: oauth2 })
  const raw = buildRawMessage({ from, to, subject, html })
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })
}

async function getTransport() {
  if (!process.env.SMTP_HOST) return null
  try {
    const nodemailer = (await import('nodemailer')).default
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  } catch (err) {
    console.error('📧 Nodemailer not installed:', err.message)
    return null
  }
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) return
  const sender = process.env.GMAIL_SENDER || process.env.SMTP_USER || BUSINESS_EMAIL
  const from = process.env.MAIL_FROM || (BUSINESS + ' <' + sender + '>')
  try {
    // 1) Preferred: official Gmail API (OAuth2).
    if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
      await sendViaGmailApi({ to, subject, html, from })
      console.log('📧 Confirmation email sent via Gmail API to', to)
      return
    }
    // 2) Fallback: generic SMTP (Nodemailer).
    const transport = await getTransport()
    if (transport) {
      await transport.sendMail({ from, to, subject, html, text })
      console.log('📧 Confirmation email sent via SMTP to', to)
      return
    }
    // 3) Not configured — log only so the app still runs.
    console.log('📧 [email not configured] would email', to, '·', subject)
  } catch (err) {
    console.error('📧 Email failed:', err.message)
  }
}

export async function sendWhatsApp({ to, body }) {
  if (!to) return
  const link = waLink(to, body)
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      const twilio = (await import('twilio')).default
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: 'whatsapp:+' + normalizePhone(to),
        body,
      })
      console.log('💬 WhatsApp sent to', to)
      return
    }
    console.log('💬 [WhatsApp not configured] click-to-send link:', link)
  } catch (err) {
    console.error('💬 WhatsApp failed:', err.message, '| fallback link:', link)
  }
}

/* ------------------------------ orchestration ----------------------------- */

// Sent to the guest when an admin accepts (confirms) the booking.
export async function notifyBookingConfirmed(booking) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut)
  const duration = durationLabel(nights)
  const subject = 'Your ' + BUSINESS + ' booking is confirmed instantly ✅ (' + duration + ')'
  const html = bookingConfirmationHtml(booking, { nights, durationText: duration })
  const text =
    'Hi ' + (booking.name || 'Guest') + ', great news! Your ' + (booking.roomType || 'room') +
    ' at ' + BUSINESS + ' is instantly confirmed for ' + duration +
    ' (' + fmtDate(booking.checkIn) + ' to ' + fmtDate(booking.checkOut) + ').' +
    ' Guests: ' + (booking.guests || 1) + '. We look forward to hosting you! — ' + BUSINESS
  await sendEmail({ to: booking.email, subject, html, text })
  await sendWhatsApp({ to: booking.mobile, body: text })
}

/* --------------------- cancellation email + orchestration --------------------- */

export function bookingCancellationHtml(booking) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut)
  const duration = durationLabel(nights)
  const row = (label, value) =>
    '<tr>' +
    '<td style="padding:10px 0;color:#64748b;font-size:13px;">' + label + '</td>' +
    '<td style="padding:10px 0;color:#0F172A;font-size:14px;font-weight:600;text-align:right;">' + (value || '—') + '</td>' +
    '</tr>'

  return [
    '<!doctype html><html><body style="margin:0;background:#f5efe6;font-family:Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe6;padding:24px 0;"><tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,.08);">',
    '<tr><td style="background:' + BRAND_NAVY + ';padding:32px 36px;text-align:center;">',
    '<div style="color:' + BRAND_GOLD + ';font-size:13px;letter-spacing:3px;text-transform:uppercase;">' + BUSINESS + '</div>',
    '<div style="color:#ffffff;font-size:24px;font-weight:700;margin-top:6px;">Booking Cancelled</div>',
    '</td></tr>',
    '<tr><td style="padding:32px 36px 8px;text-align:center;">',
    '<div style="display:inline-block;width:64px;height:64px;line-height:64px;border-radius:50%;background:#fef2f2;color:#dc2626;font-size:30px;">✕</div>',
    '<h1 style="font-size:20px;color:#0F172A;margin:18px 0 6px;">Hi ' + (booking.name || 'Guest') + ', your booking is cancelled</h1>',
    '<p style="font-size:14px;color:#64748b;margin:0;line-height:1.6;">Your <strong>' + (booking.roomType || 'room') + '</strong> reservation at ' + BUSINESS + ' has been <strong>cancelled</strong>. If this was a mistake or you would like to rebook, just reply to this email or call us — we would be happy to help.</p>',
    '</td></tr>',
    '<tr><td style="padding:16px 36px 8px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;border:1px solid #ede4d3;border-radius:12px;padding:8px 18px;">',
    row('Room', booking.roomType),
    row('Check-in', fmtDate(booking.checkIn)),
    row('Check-out', fmtDate(booking.checkOut)),
    row('Duration', duration),
    row('Guests', booking.guests),
    row('Booking ID', booking._id ? String(booking._id).slice(-8).toUpperCase() : '—'),
    '</table>',
    '</td></tr>',
    '<tr><td style="padding:24px 36px 8px;text-align:center;">',
    '<a href="tel:' + BUSINESS_PHONE.replace(/\s/g, '') + '" style="display:inline-block;background:' + BRAND_GOLD + ';color:#0F172A;font-weight:700;font-size:14px;text-decoration:none;padding:13px 28px;border-radius:10px;">Call Us: ' + BUSINESS_PHONE + '</a>',
    '</td></tr>',
    '<tr><td style="padding:24px 36px 32px;text-align:center;border-top:1px solid #f1f5f9;margin-top:16px;">',
    '<p style="font-size:12px;color:#94a3b8;margin:6px 0;">' + BUSINESS + ' · ' + BUSINESS_EMAIL + '</p>',
    '</td></tr>',
    '</table></td></tr></table></body></html>',
  ].join('')
}

// Sent to the guest when a booking is cancelled (by the guest via the website/app, or by an admin).
export async function notifyBookingCancelled(booking) {
  const subject = 'Your ' + BUSINESS + ' booking has been cancelled'
  const html = bookingCancellationHtml(booking)
  const text =
    'Hi ' + (booking.name || 'Guest') + ', your ' + (booking.roomType || 'room') +
    ' booking at ' + BUSINESS + ' (' + fmtDate(booking.checkIn) + ' to ' + fmtDate(booking.checkOut) +
    ') has been cancelled. To rebook, reply to this email or call us. — ' + BUSINESS
  await sendEmail({ to: booking.email, subject, html, text })
  await sendWhatsApp({ to: booking.mobile, body: text })
}

export function notifyNewBooking(booking) {
  const to = process.env.NOTIFY_EMAIL || 'owner@sawtaguesthouse.com'
  console.log('\n🔔 NEW BOOKING INQUIRY')
  console.log('  Notify:', to)
  console.log('  Guest :', booking.name, '|', booking.mobile)
  console.log('  Room  :', booking.roomType, '|', booking.guests, 'guest(s)')
  console.log('  Dates :', booking.checkIn, '->', booking.checkOut)
  console.log('  Source:', booking.source, '\n')
}

export function notifyNewContact(msg) {
  console.log('\n✉️  NEW CONTACT MESSAGE from', msg.name, '<' + msg.email + '>', '-', msg.subject, '\n')
}

/* --------------------- thank-you (stay completed) email --------------------- */

export function bookingThankYouHtml(booking) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut)
  const duration = durationLabel(nights)
  const row = (label, value) =>
    '<tr>' +
    '<td style="padding:10px 0;color:#64748b;font-size:13px;">' + label + '</td>' +
    '<td style="padding:10px 0;color:#0F172A;font-size:14px;font-weight:600;text-align:right;">' + (value || '\u2014') + '</td>' +
    '</tr>'

  return [
    '<!doctype html><html><body style="margin:0;background:#f5efe6;font-family:Arial,Helvetica,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe6;padding:24px 0;"><tr><td align="center">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,.08);">',
    '<tr><td style="background:' + BRAND_NAVY + ';padding:32px 36px;text-align:center;">',
    '<div style="color:' + BRAND_GOLD + ';font-size:13px;letter-spacing:3px;text-transform:uppercase;">' + BUSINESS + '</div>',
    '<div style="color:#ffffff;font-size:24px;font-weight:700;margin-top:6px;">Thank You for Choosing Us</div>',
    '</td></tr>',
    '<tr><td style="padding:32px 36px 8px;text-align:center;">',
    '<div style="display:inline-block;width:64px;height:64px;line-height:64px;border-radius:50%;background:#fff7ed;color:' + BRAND_GOLD + ';font-size:30px;">\u2605</div>',
    '<h1 style="font-size:20px;color:#0F172A;margin:18px 0 6px;">Hi ' + (booking.name || 'Guest') + ', thank you for staying with us!</h1>',
    '<p style="font-size:14px;color:#64748b;margin:0;line-height:1.6;">We hope you enjoyed your <strong>' + (booking.roomType || 'room') + '</strong> stay at ' + BUSINESS + '. It was a pleasure hosting you, and we would love to welcome you back soon. Safe travels until we meet again!</p>',
    '</td></tr>',
    '<tr><td style="padding:16px 36px 8px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;border:1px solid #ede4d3;border-radius:12px;padding:8px 18px;">',
    row('Room', booking.roomType),
    row('Check-in', fmtDate(booking.checkIn)),
    row('Check-out', fmtDate(booking.checkOut)),
    row('Duration', duration),
    row('Guests', booking.guests),
    row('Booking ID', booking._id ? String(booking._id).slice(-8).toUpperCase() : '\u2014'),
    '</table>',
    '</td></tr>',
    '<tr><td style="padding:24px 36px 8px;text-align:center;">',
    '<a href="tel:' + BUSINESS_PHONE.replace(/\s/g, '') + '" style="display:inline-block;background:' + BRAND_GOLD + ';color:#0F172A;font-weight:700;font-size:14px;text-decoration:none;padding:13px 28px;border-radius:10px;">Book Again: ' + BUSINESS_PHONE + '</a>',
    '</td></tr>',
    '<tr><td style="padding:24px 36px 32px;text-align:center;border-top:1px solid #f1f5f9;margin-top:16px;">',
    '<p style="font-size:12px;color:#94a3b8;margin:6px 0;line-height:1.6;">Loved your stay? We would be grateful if you shared a quick review.</p>',
    '<p style="font-size:12px;color:#94a3b8;margin:6px 0;">' + BUSINESS + ' \u00b7 ' + BUSINESS_EMAIL + '</p>',
    '</td></tr>',
    '</table></td></tr></table></body></html>',
  ].join('')
}

// Sent to the guest when their stay is completed (checkout date passed, or marked done by an admin).
export async function notifyBookingCompleted(booking) {
  const subject = 'Thank you for choosing ' + BUSINESS + ' \ud83d\ude4f'
  const html = bookingThankYouHtml(booking)
  const text =
    'Hi ' + (booking.name || 'Guest') + ', thank you for staying at ' + BUSINESS +
    ' (' + fmtDate(booking.checkIn) + ' to ' + fmtDate(booking.checkOut) + ').' +
    ' We hope you had a wonderful stay and look forward to welcoming you again! \u2014 ' + BUSINESS
  await sendEmail({ to: booking.email, subject, html, text })
  await sendWhatsApp({ to: booking.mobile, body: text })
}
