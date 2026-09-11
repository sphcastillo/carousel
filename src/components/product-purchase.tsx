'use client'

import {useMemo, useState} from 'react'
import {formatMoney, type LengthOption} from '@/lib/commerce'
import {useCart} from './cart-provider'

type Variant = {
  _key?: string | null
  length?: string | null
  price?: number | null
  compareAtPrice?: number | null
  inStock?: boolean | null
  shopifyVariantId?: string | null
}

export function ProductPurchase({
  productId,
  name,
  slug,
  imageUrl,
  imageAlt,
  shopifyProductId,
  variants,
}: {
  productId: string
  name: string
  slug: string
  imageUrl?: string
  imageAlt?: string
  shopifyProductId?: string | null
  variants: Variant[]
}) {
  const available = useMemo(
    () =>
      variants.filter(
        (variant): variant is Variant & {length: LengthOption; price: number} =>
          (variant.length === '18' || variant.length === '20') && typeof variant.price === 'number',
      ),
    [variants],
  )
  const [length, setLength] = useState<LengthOption>(available[0]?.length || '18')
  const {addItem} = useCart()
  const selected = available.find((variant) => variant.length === length) || available[0]

  if (!selected) return null

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-[0.19em] uppercase text-ink/60">Length</p>
        <div className="flex gap-2">
          {available.map((variant) => (
            <button
              key={variant.length}
              type="button"
              onClick={() => setLength(variant.length)}
              className={`rounded-full border px-5 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition ${
                variant.length === length
                  ? 'border-primary bg-primary text-canvas'
                  : 'border-primary/30 bg-transparent text-ink hover:border-primary'
              }`}
            >
              {variant.length}&quot;
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <p className="font-display text-4xl">{formatMoney(selected.price)}</p>
        {selected.compareAtPrice ? (
          <p className="pb-1 text-sm text-ink/45 line-through">{formatMoney(selected.compareAtPrice)}</p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={selected.inStock === false}
        onClick={() =>
          addItem({
            productId,
            slug,
            name,
            imageUrl,
            imageAlt,
            length: selected.length,
            price: selected.price,
            shopifyProductId: shopifyProductId || undefined,
            shopifyVariantId: selected.shopifyVariantId || undefined,
          })
        }
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected.inStock === false ? 'Currently restocking' : `Add ${selected.length}" to cart`}
      </button>
    </div>
  )
}
