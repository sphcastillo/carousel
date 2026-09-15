import type {Metadata} from 'next'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {ProductPurchase} from '@/components/product-purchase'
import {RichText} from '@/components/rich-text'
import {SanityImage} from '@/components/sanity-image'
import {client} from '@/sanity/client'
import {shopifySrc} from '@/lib/shopify-image'
import {productCategoryLabel} from '@/lib/product-categories'
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

  const gallery = (data.gallery || []).filter((image) => image?.asset)
  const hero = gallery[0]
  const imageUrl = hero
    ? urlFor(hero).width(1600).quality(90).url()
    : data.previewImageUrl
      ? shopifySrc(data.previewImageUrl)
      : undefined
  const optionLabel = data.optionName || 'Details'
  const categoryLabel = productCategoryLabel(data.category)

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 min-[480px]:py-12 sm:grid-cols-2 sm:items-start sm:gap-6 md:gap-10 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-[22rem] space-y-4 min-[480px]:max-w-[26rem] sm:mx-0 sm:max-w-none">
        <div className="border border-black bg-surface p-px">
          <div className="relative aspect-4/5 overflow-hidden bg-secondary/30">
            {hero ? (
              <SanityImage
                image={hero}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, (min-width: 640px) 40vw, (min-width: 480px) 26rem, 100vw"
                priority
              />
            ) : data.previewImageUrl ? (
              <Image
                src={shopifySrc(data.previewImageUrl)}
                alt={data.name || ''}
                fill
                sizes="(min-width: 768px) 50vw, (min-width: 640px) 40vw, (min-width: 480px) 26rem, 100vw"
                quality={90}
                className="object-cover"
                priority
              />
            ) : null}
          </div>
        </div>
        {gallery.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {gallery.slice(1, 5).map((image, index) => (
              <div key={index} className="overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <SanityImage image={image} fill className="object-cover" sizes="15vw" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mx-auto w-full max-w-104 sm:max-w-none">
        {categoryLabel ? (
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">
            {categoryLabel}
          </p>
        ) : null}
        <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,7vw,3.15rem)] leading-[0.86] tracking-[-0.04em] md:text-7xl">
          {data.name}
        </h1>
        {data.shortPitch ? <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70">{data.shortPitch}</p> : null}
        <ProductPurchase
          productId={data._id}
          name={data.name || 'Carousel piece'}
          slug={data.slug || slug}
          imageUrl={imageUrl}
          imageAlt={hero?.alt || data.name || ''}
          shopifyProductId={data.shopifyProductId}
          optionName={optionLabel}
          variants={data.variants || []}
        />
        <div className="mt-10 max-w-xl text-ink/75">
          <RichText value={data.description} />
        </div>
        <p className="mt-6 max-w-md text-xs leading-relaxed text-ink/60">
          * Please note that while merchandise exchanges and returns are available within 30 days, hair
          extension sales are final and non-refundable.
        </p>
      </div>
    </div>
  )
}
