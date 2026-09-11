import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {ProductPurchase} from '@/components/product-purchase'
import {RichText} from '@/components/rich-text'
import {SanityImage} from '@/components/sanity-image'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import {sanityFetch} from '@/sanity/live'
import {PRODUCT_QUERY, PRODUCT_SLUGS_QUERY} from '@/sanity/queries'

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({useCdn: false, stega: false})
    .fetch(PRODUCT_SLUGS_QUERY)
  return (slugs || [])
    .map((item) => item.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({query: PRODUCT_QUERY, params: {slug}})
  return {
    title: data?.seo?.title || data?.name || 'Product',
    description: data?.seo?.description || data?.shortPitch || undefined,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const {data} = await sanityFetch({query: PRODUCT_QUERY, params: {slug}})
  if (!data) notFound()

  const hero = data.gallery?.[0]
  const imageUrl = hero ? urlFor(hero).width(900).url() : undefined

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
      <div className="space-y-4">
        <div className="border border-primary/18 bg-surface p-[0.55rem] pb-[0.7rem]">
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
            <SanityImage image={hero} fill className="object-cover" sizes="50vw" priority />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(data.gallery || []).slice(1, 5).map((image, index) => (
            <div key={index} className="border border-primary/18 bg-surface p-[0.55rem] pb-[0.7rem]">
              <div className="relative aspect-square overflow-hidden">
                <SanityImage image={image} fill className="object-cover" sizes="15vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">01 / Length</p>
        <h1 className="font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">{data.name}</h1>
        {data.shortPitch ? <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70">{data.shortPitch}</p> : null}
        <ProductPurchase
          productId={data._id}
          name={data.name || 'Hair extensions'}
          slug={data.slug || slug}
          imageUrl={imageUrl}
          imageAlt={hero?.alt || data.name || ''}
          shopifyProductId={data.shopifyProductId}
          variants={data.variants || []}
        />
        <div className="mt-10 max-w-xl text-ink/75">
          <RichText value={data.description} />
        </div>
      </div>
    </div>
  )
}
