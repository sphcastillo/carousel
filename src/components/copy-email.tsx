'use client'

import {useState} from 'react'

export function CopyEmail({email}: {email: string}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const input = document.createElement('textarea')
      input.value = email
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.left = '-9999px'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-primary/18 bg-surface px-4 py-4">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Email me directly</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${email}`}
          className="text-sm underline decoration-primary/35 underline-offset-4 transition hover:text-primary"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Email address copied' : 'Copy email address'}
          className="rounded-full border border-primary/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-primary uppercase transition hover:bg-primary hover:text-canvas"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs leading-relaxed text-ink/60">
        {copied
          ? "It's on your clipboard — write me whenever you're ready."
          : "If the form doesn't send, copy this and email me the old-fashioned way."}
      </p>
    </div>
  )
}
