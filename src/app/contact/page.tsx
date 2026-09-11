import type {Metadata} from 'next'
import {RichText} from '@/components/rich-text'
import {sanityFetch} from '@/sanity/live'
import {CONTACT_PAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: CONTACT_PAGE_QUERY})
  return {
    title: data?.seo?.title || data?.title || 'Contact',
    description: data?.seo?.description || 'Write the Carousel studio.',
  }
}

export default async function ContactPage() {
  const [{data: page}, {data: settings}] = await Promise.all([
    sanityFetch({query: CONTACT_PAGE_QUERY}),
    sanityFetch({query: SITE_SETTINGS_QUERY}),
  ])

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8">
      <div>
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">
          {page?.eyebrow || 'A note from the studio'}
        </p>
        <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">
          {page?.headline || page?.title || 'Contact'}
        </h1>
        {page?.intro ? <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/70">{page.intro}</p> : null}
        <div className="mt-8 max-w-xl">
          <RichText value={page?.note} />
        </div>
      </div>
      <aside className="h-fit border border-primary/18 bg-surface p-[1.6rem]">
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Studio details</p>
        <p className="font-display text-3xl">Take up space.</p>
        <dl className="mt-6 space-y-4 text-sm leading-relaxed">
          {settings?.email ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Email</dt>
              <dd>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </dd>
            </div>
          ) : null}
          {settings?.phone ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Phone</dt>
              <dd>{settings.phone}</dd>
            </div>
          ) : null}
          {settings?.address ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Address</dt>
              <dd className="whitespace-pre-line">{settings.address}</dd>
            </div>
          ) : null}
          {settings?.hours ? (
            <div>
              <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink/50">Hours</dt>
              <dd className="whitespace-pre-line">{settings.hours}</dd>
            </div>
          ) : null}
        </dl>
        {settings?.email ? (
          <a
            href={`mailto:${settings.email}`}
            className="mt-8 inline-flex items-center justify-center rounded-full border border-primary px-[1.35rem] py-[0.85rem] font-mono text-[10px] tracking-[0.19em] text-primary uppercase transition hover:bg-primary hover:text-canvas"
          >
            Write the studio
          </a>
        ) : null}
      </aside>
    </div>
  )
}
