'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import {HeaderBar} from './HeaderBar'
import {WordmarkLink} from './wordmark'

type NavItem = {
  _key?: string | null
  label?: string | null
  linkType?: string | null
  internalPath?: string | null
  externalUrl?: string | null
}

type HeaderData = {
  announcement?: string | null
  logo?: {asset?: unknown} | null
  navigation?: NavItem[] | null
} | null

export function SiteHeaderFrame({data}: {data: HeaderData}) {
  const pathname = usePathname()
  const onHome = pathname === '/'
  const [overHero, setOverHero] = useState(onHome)

  useEffect(() => {
    if (!onHome) {
      setOverHero(false)
      return
    }

    const update = () => {
      const hero = document.getElementById('home-hero')
      if (!hero) {
        setOverHero(true)
        return
      }
      setOverHero(hero.getBoundingClientRect().bottom > 96)
    }

    update()
    window.addEventListener('scroll', update, {passive: true})
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onHome])

  const overlay = onHome && overHero

  return (
    <header
      className={
        overlay
          ? 'pointer-events-none fixed inset-x-0 top-0 z-50 border-0 shadow-none'
          : onHome
            ? 'fixed inset-x-0 top-0 z-50 border-0 bg-nav shadow-none'
            : 'sticky top-0 z-50 border-0 bg-nav shadow-none'
      }
    >
      <div
        className={
          overlay
            ? 'pointer-events-auto relative flex items-start justify-between px-5 py-3 md:px-10 md:py-3.5 lg:px-12'
            : 'relative flex items-center justify-between px-5 py-2.5 md:px-10 md:py-3 lg:px-12'
        }
      >
        <WordmarkLink inverted />
        <HeaderBar navigation={data?.navigation || []} compact={!overlay} />
      </div>
    </header>
  )
}
