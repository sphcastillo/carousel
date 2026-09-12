import {PersonalCuration} from '@/components/personal-curation'
import {ProductCarousel} from '@/components/product-carousel'
import {BrandStatement} from './brand-statement'
import {EditorialSplit} from './editorial-split'
import {FeaturedIn} from './featured-in'
import {HeroBlock} from './hero'
import {InstagramStrip} from './instagram-strip'
import {PortraitGallery} from './portrait-gallery'
import {TestimonialsBlock} from './testimonials'
import {VideoMaskScroll} from './video-mask'
import {urlFor} from '@/sanity/image'

export function PageBuilder({
  blocks,
  instagramHandle,
  instagramUrl,
}: {
  blocks?: Array<Record<string, unknown>> | null
  instagramHandle?: string | null
  instagramUrl?: string | null
}) {
  if (!blocks?.length) return null

  return (
    <>
      {composeHomeSections(blocks).map((block) => {
        const key = String(block._key || block._type)
        switch (block._type) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'brandStatement':
            return <BrandStatement key={key} block={block} />
          case 'featuredIn':
            return (
              <FeaturedIn
                key={key}
                heading={block.heading as string}
                features={block.features as never}
              />
            )
          case 'portraitGallery':
            return <PortraitGallery key={key} block={block} />
          case 'editorialSplit':
            return <EditorialSplit key={key} block={block} />
          case 'productCarousel':
            return (
              <ProductCarousel
                key={key}
                heading={block.heading as string}
                eyebrow={block.eyebrow as string}
                products={block.products as never}
              />
            )
          case 'personalCuration':
            return <PersonalCuration key={key} block={block} />
          case 'testimonialsBlock':
            return (
              <TestimonialsBlock
                key={key}
                heading={block.heading as string}
                testimonials={block.testimonials as never}
              />
            )
          case 'videoMoment': {
            const poster = block.poster as {asset?: unknown} | undefined
            const posterUrl = poster?.asset ? urlFor(poster as never).width(1600).url() : undefined
            return (
              <VideoMaskScroll
                key={key}
                heading={block.heading as string}
                subcopy={block.subcopy as string}
                videoUrl={block.videoUrl as string}
                posterUrl={posterUrl}
              />
            )
          }
          case 'instagramStrip':
            return (
              <InstagramStrip
                key={key}
                eyebrow={block.eyebrow as string}
                heading={block.heading as string}
                body={block.body as string}
                ctaLabel={block.ctaLabel as string}
                handle={instagramHandle}
                profileUrl={instagramUrl}
                posts={block.posts as never}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

function composeHomeSections(blocks: Array<Record<string, unknown>>) {
  const featured = blocks.filter((block) => block._type === 'featuredIn')
  const brand = blocks.filter((block) => block._type === 'brandStatement')
  const curation = blocks.filter((block) => block._type === 'personalCuration')
  const gallery = blocks.find((block) => block._type === 'portraitGallery')
  const statementBlocks =
    brand.length > 0
      ? brand
      : gallery?.statement
        ? [
            {
              _type: 'brandStatement',
              _key: `${gallery._key || 'gallery'}-statement`,
              statement: gallery.statement,
              statementAccent: gallery.statementAccent,
            },
          ]
        : []

  const rest = blocks.filter(
    (block) =>
      block._type !== 'featuredIn' &&
      block._type !== 'brandStatement' &&
      block._type !== 'personalCuration',
  )

  let placedCuration = false
  const withCuration = rest.flatMap((block) => {
    if (block._type !== 'productCarousel' || placedCuration) return [block]
    placedCuration = true
    return [block, ...curation]
  })
  const ordered = placedCuration ? withCuration : [...withCuration, ...curation]

  if (!gallery) return ordered

  return ordered.flatMap((block) =>
    block._type === 'portraitGallery' ? [...statementBlocks, ...featured, block] : [block],
  )
}
