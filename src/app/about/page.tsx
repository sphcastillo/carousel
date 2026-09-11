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

  return (
    <div>
      <section className="relative min-h-[62vh] overflow-hidden">
        {data?.heroImage ? (
          <SanityImage image={data.heroImage} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-6xl items-end px-4 pb-16 md:px-8">
          <div>
            <p className="kicker text-secondary">{data?.eyebrow || 'The world'}</p>
            <h1 className="display mt-3 text-6xl text-canvas md:text-8xl">
              {data?.headline || data?.title || 'About Carousel'}
            </h1>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-2xl px-4 py-20 md:px-8">
        <RichText value={data?.story} />
      </section>
      {data?.moments && data.moments.length > 0 ? (
        <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-24 sm:grid-cols-3 md:px-8">
          {data.moments.map((moment, index) => (
            <figure key={index} className={`photo-figure ${index === 1 ? 'sm:mt-10' : ''}`}>
              <SanityImage image={moment} className="h-full w-full object-cover" sizes="30vw" />
              <figcaption className="photo-caption">Photo figure / {String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </section>
      ) : null}
    </div>
  )
}
