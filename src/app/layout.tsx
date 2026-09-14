import type {Metadata} from 'next'
import {Cormorant_Garamond, DM_Mono, Italiana, Manrope} from 'next/font/google'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {CartProvider} from '@/components/cart-provider'
import {SiteHeader} from '@/components/site-header'
import {SanityLive} from '@/sanity/live'
import { Footer } from '@/components/Footer'
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

export const metadata: Metadata = {
  title: {
    default: 'Carousel Hair Extensions',
    template: '%s · Carousel Hair',
  },
  description: 'Vintage glamour hair extensions. Take up space.',
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
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <SanityLive />
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
