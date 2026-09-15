'use client'

import Link from 'next/link'
import {useCallback, useEffect, useRef, useState} from 'react'
import {resolveHref} from '@/lib/links'
import {SanityImage} from './sanity-image'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

type WebsiteCampaign = {
  _id: string
  _updatedAt: string
  title?: string | null
  image?: {asset?: unknown} | null
  eyebrow?: string | null
  heading?: string | null
  body?: string | null
  cta?: {
    label?: string | null
    linkType?: string | null
    internalPath?: string | null
    externalUrl?: string | null
  } | null
}

export function WebsiteCampaignModal({campaign}: {campaign: WebsiteCampaign | null}) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const storageKey = campaign
    ? `carousel:website-campaign:${campaign._id}:${campaign._updatedAt}`
    : null

  const close = useCallback(() => {
    if (storageKey && !IS_DEVELOPMENT) {
      try {
        window.localStorage.setItem(storageKey, 'dismissed')
      } catch {
        // The dialog can still close when storage is unavailable.
      }
    }
    setIsOpen(false)
  }, [storageKey])

  useEffect(() => {
    let shouldOpen = false
    try {
      shouldOpen = IS_DEVELOPMENT
        ? Boolean(storageKey)
        : Boolean(storageKey && window.localStorage.getItem(storageKey) !== 'dismissed')
    } catch {
      shouldOpen = Boolean(storageKey)
    }

    const frame = window.requestAnimationFrame(() => setIsOpen(shouldOpen))
    return () => window.cancelAnimationFrame(frame)
  }, [storageKey])

  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [close, isOpen])

  if (!campaign || !isOpen) return null

  const href = resolveHref(campaign.cta)
  const external = campaign.cta?.linkType === 'external'
  const hasImage = Boolean(campaign.image?.asset)

  return (
    <div
      className="fixed inset-0 z-80 grid place-items-center overflow-y-auto bg-ink/72 p-4 backdrop-blur-sm motion-safe:animate-campaign-backdrop sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="website-campaign-heading"
        aria-describedby={campaign.body ? 'website-campaign-body' : undefined}
        className={`relative my-auto grid w-full overflow-hidden bg-secondary text-ink shadow-2xl motion-safe:animate-campaign-modal ${
          hasImage ? 'max-w-4xl md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : 'max-w-xl'
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close campaign"
          onClick={close}
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full border border-ink/35 bg-secondary/85 font-mono text-xl leading-none text-ink backdrop-blur transition hover:bg-ink hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <span aria-hidden>×</span>
        </button>

        {hasImage ? (
          <div className="relative col-start-1 row-start-1 aspect-3/4 bg-primary/12 md:aspect-auto md:min-h-136">
            <SanityImage
              image={campaign.image}
              alt={campaign.heading || campaign.title || 'Carousel campaign'}
              fill
              fit="max"
              sizes="(min-width: 768px) 40vw, calc(100vw - 2rem)"
              quality={90}
              className="object-contain"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-ink/35 to-transparent md:hidden" />
          </div>
        ) : null}

        <div
          className={`relative z-1 flex flex-col px-7 py-10 sm:px-12 sm:py-14 md:justify-center md:py-16 ${
            hasImage
              ? 'col-start-1 row-start-1 justify-end text-canvas md:col-start-2 md:row-start-1 md:bg-secondary md:text-ink'
              : 'justify-center text-ink'
          }`}
        >
          {campaign.eyebrow ? (
            <p className="mb-5 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-current/70">
              {campaign.eyebrow}
            </p>
          ) : null}
          {campaign.heading ? (
            <h2
              id="website-campaign-heading"
              className="max-w-[12ch] font-display text-[clamp(3.2rem,7vw,5.8rem)] leading-[0.86] tracking-[-0.045em]"
            >
              {campaign.heading}
            </h2>
          ) : null}
          {campaign.body ? (
            <p id="website-campaign-body" className="mt-6 max-w-md text-[0.9rem] leading-[1.65] text-current/80">
              {campaign.body}
            </p>
          ) : null}
          {href && campaign.cta?.label ? (
            <Link
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              onClick={close}
              className="mt-8 w-fit rounded-full bg-ink px-6 py-3.5 font-mono text-[0.62rem] tracking-[0.18em] text-secondary uppercase transition hover:bg-primary hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {campaign.cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
