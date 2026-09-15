import type {Metadata} from 'next'
import {Cormorant_Garamond, DM_Mono, Italiana, Manrope} from 'next/font/google'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {SiteHeader} from '@/components/site-header'
import {Footer} from '@/components/Footer'
import {urlFor} from '@/sanity/image'
import {SanityLive, sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import './globals.css'


const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-mono',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-cormorant',
})

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    perspective: 'published',
  })
  const favicon = settings?.favicon
  const hasFavicon = Boolean(favicon?.asset)
  const faviconUrl = favicon?.asset
    ? urlFor(favicon).width(64).height(64).fit('crop').format('png').url()
    : '/favicon.svg'

  return {
    title: {
      default: 'Carousel Hair Extensions',
      template: '%s · Carousel Hair',
    },
    description: 'Vintage glamour hair extensions. Take up space.',
    icons: {
      icon: [
        {
          url: faviconUrl,
          type: hasFavicon ? 'image/png' : 'image/svg+xml',
          sizes: '64x64',
        },
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${italiana.variable} ${dmMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
