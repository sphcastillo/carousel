'use client'

import Link from 'next/link'
import {useState} from 'react'
import {resolveHref} from '@/lib/links'
import {useCart} from './cart-provider'

type NavItem = {
  _key?: string | null
  label?: string | null
  linkType?: string | null
  internalPath?: string | null
  externalUrl?: string | null
}

export function HeaderBar({
  navigation,
  compact = false,
}: {
  navigation: NavItem[]
  compact?: boolean
}) {
  const {itemCount} = useCart()
  const [open, setOpen] = useState(false)
  const paddedCount = String(itemCount).padStart(2, '0')
  const linkClass =
    'font-mono text-[10px] tracking-[0.22em] uppercase text-canvas/80 transition hover:text-canvas'

  return (
    <>
      <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
        <NavLinks navigation={navigation} className={linkClass} />
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-canvas/80 transition hover:text-canvas"
        >
          Cart / {paddedCount}
        </Link>
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-canvas/55 px-3 py-1 font-mono text-[10px] tracking-[0.19em] text-canvas uppercase transition hover:bg-canvas hover:text-ink"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={
            compact
              ? 'absolute inset-x-0 top-full bg-nav px-5 py-6 md:hidden'
              : 'absolute inset-x-0 top-full bg-ink/80 px-5 py-6 backdrop-blur-xl md:hidden'
          }
        >
          <nav className="flex flex-col gap-4">
            <NavLinks
              navigation={navigation}
              className="font-display text-3xl text-canvas"
              onClick={() => setOpen(false)}
            />
          </nav>
        </div>
      ) : null}
    </>
  )
}

function NavLinks({
  navigation,
  className,
  onClick,
}: {
  navigation: NavItem[]
  className: string
  onClick?: () => void
}) {
  return (
    <>
      {navigation.map((item) => {
        const href = resolveHref(item)
        if (!href || !item.label) return null
        if (item.label.trim().toLowerCase() === 'instagram') return null
        const external = item.linkType === 'external'
        return (
          <Link
            key={item._key || item.label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className={className}
            onClick={onClick}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
