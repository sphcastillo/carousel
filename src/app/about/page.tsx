import type {Metadata} from 'next'
import {RichText} from '@/components/rich-text'
import {SanityImage} from '@/components/sanity-image'
import {sanityFetch} from '@/sanity/live'
import {ABOUT_PAGE_QUERY} from '@/sanity/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: ABOUT_PAGE_QUERY})
  return {
    title: data?.seo?.title || data?.title || 'About',
    description: data?.seo?.description || 'The story behind Carousel Hair Extensions.',
  }
}

export default async function AboutPage() {
  const {data} = await sanityFetch({query: ABOUT_PAGE_QUERY})
  const moments = data?.moments?.filter((moment) => moment?.asset).slice(0, 4) ?? []

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pt-16 md:px-8 md:pt-20">
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">
          {data?.eyebrow || 'The world'}
        </p>
        <h1 className="max-w-4xl font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">
          {data?.headline || data?.title || 'About Carousel'}
        </h1>
      </section>

      {data?.heroImage?.asset ? (
        <section className="mx-auto max-w-6xl px-5 pt-8 md:px-8 md:pt-10">
          <figure className="overflow-hidden">
            <SanityImage
              image={data.heroImage}
              alt={data.headline || data.title || 'About Carousel'}
              className="h-auto max-h-144 w-full object-cover object-center"
              sizes="(min-width: 1152px) 1100px, calc(100vw - 2.5rem)"
              srcWidth={2400}
              quality={90}
              fit="max"
              priority
            />
          </figure>
        </section>
      ) : null}

      <section className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-20">
        <RichText value={data?.story} />
      </section>

      {moments.length > 0 ? (
        <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-5 pb-24 min-[540px]:grid-cols-4 md:gap-5 md:px-8">
          {moments.map((moment, index) => (
            <figure key={moment.asset?._id || index}>
              <div className="relative aspect-3/4 overflow-hidden">
                <SanityImage
                  image={moment}
                  fill
                  fit="crop"
                  className="object-cover"
                  sizes="(min-width: 540px) 25vw, 50vw"
                  srcWidth={1400}
                  quality={90}
                />
              </div>
            </figure>
          ))}
        </section>
      ) : null}
    </div>
  )
}
