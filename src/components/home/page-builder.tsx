import {ProductCarousel} from '@/components/product-carousel'
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
      {blocks.map((block) => {
        const key = String(block._key || block._type)
        switch (block._type) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
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
          case 'testimonialsBlock':
            return (
              <TestimonialsBlock
                key={key}
                heading={block.heading as string}
                testimonials={block.testimonials as never}
              />
            )
          case 'featuredIn':
            return (
              <FeaturedIn
                key={key}
                heading={block.heading as string}
                features={block.features as never}
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
                heading={block.heading as string}
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
