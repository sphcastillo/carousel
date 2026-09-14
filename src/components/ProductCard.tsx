import Link from 'next/link'
import Image from 'next/image'
import {formatMoney, isLengthOption} from '@/lib/commerce'
import {shopifySrc} from '@/lib/shopify-image'
import {SanityImage} from './sanity-image'

export type ProductCardProduct = {
  _id: string
  name: string | null
  slug: string | null
  href?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  currencyCode?: string
  shortPitch?: string | null
  gallery?: {
    alt?: string | null
    asset?: unknown
  } | null
  variants?: Array<{
    _key?: string | null
    length?: string | null
    price?: number | null
    compareAtPrice?: number | null
  }> | null
}

const SHOP_CARD_SIZES = '(min-width: 1024px) 33vw, 50vw'

export function ProductCard({
  product,
  sizes = SHOP_CARD_SIZES,
}: {
  product: ProductCardProduct
  sizes?: string
}) {
  const lengths = Array.from(
    new Set(
      (product.variants || [])
        .map((variant) => variant.length)
        .filter(
          (length): length is string =>
            Boolean(length) && length !== 'Default Title',
        ),
    ),
  )
  const prices = (product.variants || []).map((variant) => variant.price).filter((price): price is number => typeof price === 'number')
  const fromPrice = prices.length ? Math.min(...prices) : null

  return (
    <Link href={product.href || (product.slug ? `/shop/${product.slug}` : '/shop')} className="group block">
      <article>
        <div className="border border-black bg-surface p-px">
          <div className="relative aspect-3/4 overflow-hidden bg-canvas">
            {product.imageUrl ? (
              <Image
                src={shopifySrc(product.imageUrl)}
                alt={product.imageAlt || product.name || ''}
                fill
                sizes={sizes}
                quality={90}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            ) : (
              <SanityImage
                image={product.gallery}
                alt={product.gallery?.alt || product.name || ''}
                fill
                sizes={sizes}
                srcWidth={1600}
                fit="max"
                quality={90}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute left-3 top-3 flex gap-1">
              {lengths.map((length) => (
                <span
                  key={length}
                  className="rounded-full border border-black/70 bg-canvas/88 px-[0.55rem] py-[0.2rem] font-mono text-[0.58rem] tracking-[0.16em] text-black uppercase"
                >
                  {isLengthOption(length) ? `${length}"` : length}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 px-1 text-black">
          <h3 className="font-display text-[1.65rem] leading-[0.92] tracking-[-0.03em]">
            {product.name}
          </h3>
          {product.shortPitch ? (
            <p className="mt-1.5 font-sans text-[0.86rem] leading-[1.55] text-black/65">
              {product.shortPitch}
            </p>
          ) : null}
          {fromPrice != null ? (
            <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-black/70 uppercase">
              From {product.currencyCode
                ? new Intl.NumberFormat('en-US', {style: 'currency', currency: product.currencyCode}).format(fromPrice)
                : formatMoney(fromPrice)}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
