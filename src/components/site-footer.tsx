import Link from 'next/link'
import {sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {Wordmark} from './wordmark'

export async function SiteFooter() {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})

  return (
    <footer className="relative mt-24 border-t border-primary/15 bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-3 md:px-8">
        <div>
          <Wordmark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
            {data?.footerBlurb ||
              'Carousel is an invitation to make the getting-ready moment feel like the main event.'}
          </p>
        </div>
        <div>
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Visit</p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink/75">
            {data?.address || 'By appointment, Miami'}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-ink/75">{data?.hours}</p>
        </div>
        <div>
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Say hello</p>
          {data?.email ? (
            <p>
              <a className="text-sm underline decoration-primary/40" href={`mailto:${data.email}`}>
                {data.email}
              </a>
            </p>
          ) : null}
          {data?.phone ? <p className="mt-2 text-sm">{data.phone}</p> : null}
          {data?.instagramUrl ? (
            <p className="mt-2">
              <Link href={data.instagramUrl} className="text-sm underline decoration-accent" target="_blank">
                @{data.instagramHandle || 'carouselhair'}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
      <p className="pb-8 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-ink/45">
        Carousel Hair Extensions / vintage glamour
      </p>
    </footer>
  )
}
