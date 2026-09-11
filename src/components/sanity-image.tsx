import Image from 'next/image'
import {urlFor} from '@/sanity/image'

type SanityImageValue = {
  alt?: string | null
  asset?: {
    _id?: string
    url?: string | null
    metadata?: {
      lqip?: string | null
      dimensions?: {width?: number; height?: number} | null
    } | null
  } | null
  hotspot?: unknown
  crop?: unknown
} | null

export function SanityImage({
  image,
  alt,
  className,
  sizes = '100vw',
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  srcWidth,
}: {
  image?: unknown
  alt?: string
  className?: string
  sizes?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  quality?: number
  srcWidth?: number
}) {
  const value = image as SanityImageValue
  if (!value?.asset) return null

  const resolvedAlt = alt || value.alt || ''
  const lqip = value.asset.metadata?.lqip || undefined
  const nativeWidth = value.asset.metadata?.dimensions?.width
  const requestedWidth = srcWidth || width || (fill ? 2400 : 1600)
  const targetWidth = nativeWidth ? Math.min(requestedWidth, nativeWidth) : requestedWidth
  let builder = urlFor(value).auto('format').quality(quality)
  if (value.hotspot || value.crop) {
    builder = builder.fit('crop')
  }
  const src = builder.width(Math.round(targetWidth)).url()

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        className={className}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        priority={priority}
        quality={quality}
      />
    )
  }

  const w = width || value.asset.metadata?.dimensions?.width || 1200
  const h = height || value.asset.metadata?.dimensions?.height || 1500

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={w}
      height={h}
      sizes={sizes}
      className={className}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      priority={priority}
      quality={quality}
    />
  )
}
