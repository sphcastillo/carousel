export const CONTACT_TO_EMAIL_DEFAULT = 'carouselhairextensions@gmail.com'

export type ContactPayload = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website: string
}

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 160,
  message: 5000,
  website: 200,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function readField(body: unknown, key: keyof ContactPayload, max: number) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return ''
  const value = (body as Record<string, unknown>)[key]
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function parseContactPayload(body: unknown): ContactPayload {
  return {
    name: readField(body, 'name', LIMITS.name),
    email: readField(body, 'email', LIMITS.email),
    phone: readField(body, 'phone', LIMITS.phone),
    subject: readField(body, 'subject', LIMITS.subject),
    message: readField(body, 'message', LIMITS.message),
    website: readField(body, 'website', LIMITS.website),
  }
}

export function validateContactPayload(payload: ContactPayload) {
  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return 'Please share your name, email, subject, and message.'
  }
  if (!EMAIL_PATTERN.test(payload.email)) {
    return 'Please share a valid email so I can write you back.'
  }
  return null
}

export function contactEmailHtml(payload: ContactPayload) {
  const rows = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone || '—'],
    ['Subject', payload.subject],
  ]
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 12px;font-size:14px;line-height:1.5"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    )
    .join('')

  const message = escapeHtml(payload.message).replaceAll('\n', '<br />')

  return `
    <div style="font-family:Georgia,serif;color:#2a1216;line-height:1.6">
      <p style="margin:0 0 20px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#a41a28">Carousel inquiry</p>
      ${rows}
      <p style="margin:20px 0 8px;font-size:14px"><strong>Message</strong></p>
      <p style="margin:0;font-size:14px">${message}</p>
    </div>
  `
}

export function contactEmailText(payload: ContactPayload) {
  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || '—'}`,
    `Subject: ${payload.subject}`,
    '',
    payload.message,
  ].join('\n')
}
