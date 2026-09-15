import {Resend} from 'resend'
import {
  CONTACT_TO_EMAIL_DEFAULT,
  contactEmailHtml,
  contactEmailText,
  parseContactPayload,
  validateContactPayload,
} from '@/lib/contact'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ok: false, error: 'That note could not be read. Please try again.'}, {status: 400})
  }

  const payload = parseContactPayload(body)
  if (payload.website) {
    return Response.json({ok: true})
  }

  const validationError = validateContactPayload(payload)
  if (validationError) {
    return Response.json({ok: false, error: validationError}, {status: 400})
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim() || CONTACT_TO_EMAIL_DEFAULT

  if (!apiKey || !from) {
    console.error('[contact] Missing email configuration:', [
      !apiKey && 'RESEND_API_KEY',
      !from && 'RESEND_FROM_EMAIL',
    ].filter(Boolean).join(', '))
    return Response.json(
      {ok: false, error: "I couldn't receive this just now. Copy my email and write me there."},
      {status: 500},
    )
  }

  try {
    const resend = new Resend(apiKey)
    const {data, error} = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: `[Carousel] ${payload.subject}`,
      html: contactEmailHtml(payload),
      text: contactEmailText(payload),
    })

    if (!error && data?.id) return Response.json({ok: true})

    // Serialize explicitly: Next's development log can record object arguments as {}.
    console.error('[contact] Resend rejected the message:', JSON.stringify(error
      ? {name: error.name, message: error.message, statusCode: error.statusCode}
      : {message: 'No email ID returned by Resend'}))
  } catch (error) {
    console.error('[contact] Email request failed:', JSON.stringify({
      name: error instanceof Error ? error.name : 'UnknownError',
      message: 'Unable to complete the Resend request. Check network connectivity and Resend availability.',
    }))
  }

  return Response.json(
    {ok: false, error: "I couldn't receive this just now. Copy my email and write me there."},
    {status: 502},
  )
}
