import {PersonalCuration} from '@/components/personal-curation'
import {ProductCarousel} from '@/components/ProductCarousel'
import type {ProductCardProduct} from '@/components/ProductCard'
import {BrandStatement} from './brand-statement'
import {EditorialSplit} from './EditorialSplit'
import {FeaturedIn} from './FeaturedIn'

import {InstagramStrip} from './InstagramStrip'
import {PortraitGallery} from './PortraitGallery'
import {VideoMaskScroll} from './VideoMask'
import {urlFor} from '@/sanity/image'
import { Testimonials } from '../Testimonials'
import { Hero } from '../Hero'

const FAVORITES_SLUGS = ['carousel-favorites', 'bestsellers']
const PONYTAILS_SLUGS = ['carousel-ponytails']

export function PageBuilder({
  blocks,
  favorites,
  ponytails,
  instagramHandle,
  instagramUrl,
}: {
  blocks?: Array<Record<string, unknown>> | null
  favorites?: ProductCardProduct[] | null
  ponytails?: ProductCardProduct[] | null
  instagramHandle?: string | null
  instagramUrl?: string | null
}) {
  if (!blocks?.length) return null

  const carouselBlocks = blocks.filter((block) => block._type === 'productCarousel')
  const favoritesBlock =
    carouselBlocks.find((block) => FAVORITES_SLUGS.includes(String(block.collectionSlug || ''))) ||
    carouselBlocks[0]
  const ponytailsBlock = carouselBlocks.find(
    (block) =>
      block !== favoritesBlock &&
      PONYTAILS_SLUGS.includes(String(block.collectionSlug || '')),
  ) || carouselBlocks.find((block) => block !== favoritesBlock)

  return (
    <>
      {composeHomeSections(blocks, favoritesBlock, ponytailsBlock).map((block) => {
        const key = String(block._key || block._type)
        switch (block._type) {
          case 'hero':
            return <Hero key={key} block={block} />
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
          case 'productCarousel': {
            const products =
              block === favoritesBlock && favorites != null
                ? favorites
                : block === ponytailsBlock && ponytails != null
                  ? ponytails
                  : (block.products as never)
            return (
              <ProductCarousel
                key={key}
                heading={block.heading as string}
                eyebrow={block.eyebrow as string}
                products={products}
              />
            )
          }
          case 'personalCuration':
            return <PersonalCuration key={key} block={block} />
          case 'testimonialsBlock':
            return (
              <Testimonials
                key={key}
                eyebrow={block.eyebrow as string}
                heading={block.heading as string}
                testimonials={block.testimonials as never}
              />
            )
          case 'videoMoment': {
            const poster = block.poster as {asset?: {_id?: string} | null} | undefined
            const posterUrl = poster?.asset
              ? `${urlFor(poster as never).width(1600).url()}${poster.asset._id ? `&v=${encodeURIComponent(poster.asset._id)}` : ''}`
              : undefined
            return (
              <VideoMaskScroll
                key={key}
                eyebrow={block.eyebrow as string}
                heading={block.heading as string}
                subcopy={block.subcopy as string}
                posterUrl={posterUrl}
              />
            )
          }
          // case 'instagramStrip':
          //   return (
          //     <InstagramStrip
          //       key={key}
          //       eyebrow={block.eyebrow as string}
          //       heading={block.heading as string}
          //       body={block.body as string}
          //       ctaLabel={block.ctaLabel as string}
          //       handle={instagramHandle}
          //       profileUrl={instagramUrl}
          //       posts={block.posts as never}
          //     />
          //   )
          default:
            return null
        }
      })}
    </>
  )
}

function composeHomeSections(
  blocks: Array<Record<string, unknown>>,
  favoritesCarousel?: Record<string, unknown>,
  ponytailsCarousel?: Record<string, unknown>,
) {
  const featured = blocks.filter((block) => block._type === 'featuredIn')
  const brand = blocks.filter((block) => block._type === 'brandStatement')
  const curation = blocks.filter((block) => block._type === 'personalCuration')
  const gallery = blocks.find((block) => block._type === 'portraitGallery')
  const video = blocks.find((block) => block._type === 'videoMoment')
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
      block._type !== 'personalCuration' &&
      !(gallery && favoritesCarousel && block === favoritesCarousel) &&
      !(video && ponytailsCarousel && block === ponytailsCarousel),
  )

  let placedCuration = false
  const withCuration = rest.flatMap((block) => {
    if (gallery && block._type === 'portraitGallery') {
      placedCuration = true
      return [
        ...statementBlocks,
        ...featured,
        block,
        ...(favoritesCarousel ? [favoritesCarousel] : []),
        ...curation,
      ]
    }

    if (video && block._type === 'videoMoment') {
      return [block, ...(ponytailsCarousel ? [ponytailsCarousel] : [])]
    }

    if (!gallery && block._type === 'productCarousel' && !placedCuration) {
      placedCuration = true
      return [block, ...curation]
    }

    return [block]
  })

  return placedCuration ? withCuration : [...withCuration, ...curation]
}
