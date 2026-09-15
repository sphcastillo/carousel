import Link from 'next/link'
import {SOCIALS} from '@/lib/socials'
import {sanityFetch} from '@/sanity/live'
import {SITE_SETTINGS_QUERY} from '@/sanity/queries'

export async function Footer() {
  const {data} = await sanityFetch({query: SITE_SETTINGS_QUERY})
  const year = new Date().getFullYear()

  return (
    <footer className="bg-accent">
      <div className="mx-auto max-w-368 px-5 pt-16 pb-8 md:px-10 md:pt-20 md:pb-10 gallery:px-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <Link
            href="/"
            className="font-display text-[clamp(3.8rem,8vw,6.4rem)] leading-[0.78] tracking-tighter text-ink"
          >
            Carousel Hair Extensions
          </Link>
          {data?.footerBlurb ? (
            <p className="whitespace-nowrap text-[0.86rem] leading-[1.55] text-ink/78 md:mb-3 md:text-right">
              {data.footerBlurb}
            </p>
          ) : null}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/18 pt-4 font-mono text-[9px] tracking-[0.18em] text-ink/55 uppercase md:mt-16 md:grid md:grid-cols-3 md:items-center md:gap-4">
          <p className="order-3 md:order-1">
            Site by{' '}
            <a
              href="https://www.builtbysophia.com"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-ink/35 underline-offset-4 transition hover:text-ink"
            >
              Built By Sophia
            </a>
          </p>
          <nav aria-label="Social media" className="order-1 flex items-center gap-5 md:order-2 md:justify-center">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-ink"
              >
                {social.label}
              </a>
            ))}
          </nav>
          <p className="order-2 md:order-3 md:text-right">
            © {year} {data?.siteTitle}
          </p>
        </div>
      </div>
    </footer>
  )
}
