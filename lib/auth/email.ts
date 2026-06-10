export interface VerificationEmailParams {
  toEmail: string
  firstName: string
  token: string
}

type EmailProvider = 'console' | 'resend' | 'sendgrid' | 'postmark'

function getProvider(): EmailProvider {
  const p = (process.env.EMAIL_PROVIDER || 'console').toLowerCase()
  if (['resend', 'sendgrid', 'postmark'].includes(p)) return p as EmailProvider
  return 'console'
}

function buildEmailBody(firstName: string, token: string): { subject: string; text: string; html: string } {
  const subject = 'Your Level Up verification code'
  const text = `Hi ${firstName},\n\nYour Level Up verification code is:\n\n${token}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <h1 style="font-size:28px;font-weight:900;color:#7c3aed;margin-bottom:8px">Level Up 🚀</h1>
      <p style="color:#374151;font-size:16px">Hi <strong>${firstName}</strong>,</p>
      <p style="color:#374151;font-size:16px">Your verification code is:</p>
      <div style="background:#f3f4f6;border-radius:16px;padding:24px;text-align:center;margin:24px 0">
        <span style="font-size:48px;font-weight:900;letter-spacing:12px;color:#1f2937">${token}</span>
      </div>
      <p style="color:#6b7280;font-size:14px">This code expires in <strong>15 minutes</strong>.</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">If you did not request this, you can ignore this email.</p>
    </div>
  `
  return { subject, text, html }
}

async function sendViaResend(to: string, subject: string, html: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM_ADDRESS || 'Level Up <no-reply@levelup.app>',
      to,
      subject,
      html,
      text,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error: ${err}`)
  }
}

async function sendViaSendGrid(to: string, subject: string, html: string, text: string) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: process.env.EMAIL_FROM_ADDRESS || 'no-reply@levelup.app' },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html',  value: html },
      ],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SendGrid error: ${err}`)
  }
}

async function sendViaPostmark(to: string, subject: string, html: string, text: string) {
  const res = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY || '',
    },
    body: JSON.stringify({
      From:     process.env.EMAIL_FROM_ADDRESS || 'no-reply@levelup.app',
      To:       to,
      Subject:  subject,
      HtmlBody: html,
      TextBody: text,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Postmark error: ${err}`)
  }
}

export async function sendVerificationEmail(params: VerificationEmailParams): Promise<void> {
  const { toEmail, firstName, token } = params
  const { subject, text, html } = buildEmailBody(firstName, token)
  const provider = getProvider()

  if (provider === 'console' || process.env.NODE_ENV === 'development') {
    // Always log in dev so token is accessible without email setup
    console.log('\n═══════════════════════════════════════')
    console.log('📧  DEV EMAIL — Level Up Verification')
    console.log('═══════════════════════════════════════')
    console.log(`  To:    ${toEmail}`)
    console.log(`  Name:  ${firstName}`)
    console.log(`  Token: ${token}`)
    console.log('═══════════════════════════════════════\n')
  }

  if (provider === 'resend')    return sendViaResend(toEmail, subject, html, text)
  if (provider === 'sendgrid')  return sendViaSendGrid(toEmail, subject, html, text)
  if (provider === 'postmark')  return sendViaPostmark(toEmail, subject, html, text)
  // console provider: logged above, nothing more to do
}
