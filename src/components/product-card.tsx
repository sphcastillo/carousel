import Link from 'next/link'
import {formatMoney} from '@/lib/commerce'
import {SanityImage} from './sanity-image'

export type ProductCardProduct = {
  _id: string
  name: string | null
  slug: string | null
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

export function ProductCard({product}: {product: ProductCardProduct}) {
  const lengths = (product.variants || [])
    .map((variant) => variant.length)
    .filter((length): length is string => Boolean(length))
  const prices = (product.variants || []).map((variant) => variant.price).filter((price): price is number => typeof price === 'number')
  const fromPrice = prices.length ? Math.min(...prices) : null

  return (
    <Link href={product.slug ? `/shop/${product.slug}` : '/shop'} className="group block">
      <article>
        <div className="border border-primary/18 bg-surface p-[0.55rem] pb-[0.7rem]">
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
            <SanityImage
              image={product.gallery}
              alt={product.gallery?.alt || product.name || ''}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 flex gap-1">
              {lengths.map((length) => (
                <span
                  key={length}
                  className="rounded-full border border-canvas/70 bg-canvas/88 px-[0.55rem] py-[0.2rem] font-mono text-[0.58rem] tracking-[0.16em] uppercase"
                >
                  {length}&quot;
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 px-1">
          <h3 className="font-display text-2xl text-ink">{product.name}</h3>
          {product.shortPitch ? (
            <p className="mt-1 text-sm text-ink/65">{product.shortPitch}</p>
          ) : null}
          {fromPrice != null ? (
            <p className="mt-2 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/70">
              From {formatMoney(fromPrice)}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
