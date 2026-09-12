import Link from 'next/link'
import {sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'

export async function SiteFooter() {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 bg-accent">
      <div className="mx-auto max-w-368 px-5 pt-16 pb-8 md:px-10 md:pt-20 md:pb-10 gallery:px-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <Link
            href="/"
            className="font-display text-[clamp(5.2rem,16vw,11rem)] leading-[0.78] tracking-tighter text-ink"
          >
            Carousel Hair Extensions
          </Link>
          {data?.footerBlurb ? (
            <p className="max-w-64 text-[0.86rem] leading-[1.55] text-ink/78 md:mb-3 md:text-right">
              {data.footerBlurb}
            </p>
          ) : null}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink/18 pt-4 font-mono text-[9px] tracking-[0.18em] text-ink/55 uppercase md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>{data?.siteTitle}</p>
          <p>Site by {" "}
            <a
              href="https://www.builtbysophia.com"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/35 underline-offset-4 transition hover:text-ink"
            >
              Built By Sophia
            </a>
          </p>
          <p>© {year} {data?.siteTitle}</p>
        </div>
      </div>
    </footer>
  )
}
