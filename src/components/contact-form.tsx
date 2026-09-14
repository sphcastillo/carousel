'use client'

import {useState, type FormEvent} from 'react'

const fieldClassName =
  'mt-2 w-full border border-primary/18 bg-canvas px-3 py-3 text-sm tracking-normal text-ink outline-none transition focus:border-primary'

export function ContactForm({email}: {email?: string}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          subject: data.get('subject'),
          message: data.get('message'),
          website: data.get('website'),
        }),
      })
      const result = (await response.json()) as {ok?: boolean; error?: string}
      if (!response.ok || !result.ok) {
        setError(
          result.error ||
            (email
              ? `I couldn't receive this just now. Copy ${email} and write me there.`
              : "I couldn't receive this just now. Please try again, or email me directly."),
        )
        return
      }
      setSent(true)
    } catch {
      setError(
        email
          ? `I couldn't receive this just now. Copy ${email} and write me there.`
          : "I couldn't receive this just now. Please try again, or email me directly.",
      )
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <div>
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Sent</p>
        <p className="font-display text-4xl leading-[0.86] tracking-[-0.04em]">I got your note.</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          Thank you, love. I'll read it myself and write you back as soon as I can.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <div>
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Write me</p>
        <h2 className="font-display text-4xl leading-[0.86] tracking-[-0.04em]">Tell me everything</h2>
      </div>

      <label className="sr-only" htmlFor="website" aria-hidden>
        Website
      </label>
      <input
        id="website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
          Name
          <input required name="name" autoComplete="name" className={fieldClassName} />
        </label>
        <label className="block font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
          Email
          <input required type="email" name="email" autoComplete="email" className={fieldClassName} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
          Phone
          <input type="tel" name="phone" autoComplete="tel" className={fieldClassName} />
        </label>
        <label className="block font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
          Subject
          <input required name="subject" className={fieldClassName} />
        </label>
      </div>

      <label className="block font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
        Message
        <textarea
          required
          name="message"
          rows={5}
          className={`${fieldClassName} resize-y`}
          placeholder="A custom color, a length, a texture — or just a question. I want to hear it."
        />
      </label>

      {error ? <p className="text-sm leading-relaxed text-primary">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send it to me'}
      </button>
    </form>
  )
}
