import { Resend } from 'resend'

const emailTemplate = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f7f6f3; font-family: system-ui, sans-serif; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { background: #047857; padding: 32px 40px; text-align: center; }
    .header-logo { font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -1px; }
    .header-tagline { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
    .body { padding: 36px 40px; }
    .title { font-size: 22px; font-weight: 800; color: #0d0d0d; letter-spacing: -0.5px; margin-bottom: 16px; }
    .text { font-size: 14px; color: #6B7280; line-height: 1.7; margin-bottom: 12px; }
    .highlight { background: #F5F3FF; border-radius: 10px; padding: 16px 20px; margin: 20px 0; }
    .highlight-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
    .highlight-label { color: #9CA3AF; font-weight: 500; }
    .highlight-value { color: #0d0d0d; font-weight: 600; }
    .footer { background: #fafafa; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB; }
    .footer-text { font-size: 12px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo"> TiffinBox</div>
      <div class="header-tagline">Taste the home you miss.</div>
    </div>
    <div class="body">
      <div class="title">${title}</div>
      ${body}
    </div>
    <div class="footer">
      <div class="footer-text">© 2026 TiffinBox · Fresh homemade meals delivered to your door</div>
      <div class="footer-text" style="margin-top: 4px;">This is an automated message, please do not reply.</div>
    </div>
  </div>
</body>
</html>
`

const sendEmail = async (to, subject, title, body) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is not configured')
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: emailTemplate(title, body),
    })

    if (error) throw new Error(error.message)

  } catch (error) {
    console.error('Email failed:', error.message)
    throw error
  }
}

export default sendEmail