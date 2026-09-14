import type {Metadata} from 'next'
import Image from 'next/image'
import {ContactForm} from '@/components/contact-form'
import {CopyEmail} from '@/components/copy-email'
import {RichText} from '@/components/rich-text'
import {SanityImage} from '@/components/sanity-image'
import {CONTACT_TO_EMAIL_DEFAULT} from '@/lib/contact'
import {sanityFetch} from '@/sanity/live'
import {CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'

const FALLBACK_EYEBROW = 'A note from me'
const FALLBACK_HEADLINE = 'Hello, love'
const FALLBACK_INTRO = `I'm so glad you're here. Custom pieces are my favorite part of this work — a color that's only yours, a length that feels just right, a texture you've been dreaming about, or something no one's worn before.

Tell me what you're imagining. I read every note myself, and I'll write you back as soon as I can.`

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: CONTACT_PAGE_QUERY})
  return {
    title: data?.seo?.title || data?.title || 'Contact',
    description: data?.seo?.description || 'Write Breanna at Carousel Hair Extensions.',
  }
}

export default async function ContactPage() {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: CONTACT_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  const email = settings?.email?.trim() || CONTACT_TO_EMAIL_DEFAULT
  const intro = page?.intro?.trim() || FALLBACK_INTRO
  const address = settings?.address?.trim()
  const hours = settings?.hours?.trim()
  const portrait = page?.portrait
  const hasPortrait = Boolean(portrait?.asset)

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14">
      <figure className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
        {hasPortrait ? (
          <SanityImage
            image={portrait}
            alt="Breanna, founder of Carousel Hair Extensions, reclining in a cherry-print dress"
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 22rem, 20rem"
            quality={90}
            priority
          />
        ) : (
          <Image
            src="/images/breanna-contact.jpg"
            alt="Breanna, founder of Carousel Hair Extensions, reclining in a cherry-print dress"
            width={673}
            height={1024}
            priority
            quality={90}
            sizes="(min-width: 1024px) 22rem, 20rem"
            className="h-auto w-full object-cover"
          />
        )}
        {portrait?.caption ? (
          <figcaption className="mt-[0.55rem] font-mono text-[0.58rem] tracking-[0.16em] text-ink/62 uppercase">
            {portrait.caption}
          </figcaption>
        ) : null}
      </figure>

      <div>
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">
          {page?.eyebrow || FALLBACK_EYEBROW}
        </p>
        <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">
          {page?.headline || page?.title || FALLBACK_HEADLINE}
        </h1>
        <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-ink/70">
          {intro.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-6 font-script text-2xl text-primary">xo, Breanna</p>
        {/* {page?.note ? (
          <div className="mt-6 max-w-xl text-sm leading-relaxed text-ink/70">
            <RichText value={page.note} />
          </div>
        ) : null} */}

        <div className="mt-8 max-w-xl">
          <CopyEmail email={email} />
        </div>

        {(address || hours) && (
          <dl className="mt-8 max-w-xl space-y-4 text-sm leading-relaxed">
            {address ? (
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Address</dt>
                <dd className="whitespace-pre-line">{address}</dd>
              </div>
            ) : null}
            {hours ? (
              <div>
                <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Hours</dt>
                <dd className="whitespace-pre-line">{hours}</dd>
              </div>
            ) : null}
          </dl>
        )}

        <aside className="mt-10 h-fit max-w-xl border border-primary/18 bg-surface p-[1.6rem]">
          <ContactForm email={email} />
        </aside>
      </div>
    </div>
  )
}
