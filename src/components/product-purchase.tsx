'use client'

import {useMemo, useState, type ReactNode} from 'react'
import {
  formatMoney,
  HAIR_TYPE_LABELS,
  isLengthOption,
  resolveHairType,
  type HairTypeOption,
  type LengthOption,
} from '@/lib/commerce'
import {useCart} from './cart-provider'

type Variant = {
  _key?: string | null
  length?: string | null
  hairType?: string | null
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
      variants
        .filter(
          (variant): variant is Variant & {length: LengthOption; price: number} =>
            isLengthOption(variant.length) && typeof variant.price === 'number',
        )
        .map((variant) => ({...variant, hairType: resolveHairType(variant.hairType)})),
    [variants],
  )
  const lengths = useMemo(
    () => [...new Set(available.map((variant) => variant.length))],
    [available],
  )
  const [length, setLength] = useState<LengthOption>(lengths[0] || '18')
  const hairTypes = useMemo(
    () =>
      [...new Set(available.filter((variant) => variant.length === length).map((variant) => variant.hairType))],
    [available, length],
  )
  const [hairType, setHairType] = useState<HairTypeOption>(hairTypes[0] || 'remy')
  const {addItem} = useCart()

  const selectedHairType = hairTypes.includes(hairType) ? hairType : hairTypes[0]
  const selected =
    available.find(
      (variant) => variant.length === length && variant.hairType === selectedHairType,
    ) || available[0]

  if (!selected) return null

  function chooseLength(next: LengthOption) {
    setLength(next)
    const types = available
      .filter((variant) => variant.length === next)
      .map((variant) => variant.hairType)
    if (!types.includes(hairType)) setHairType(types[0] || 'remy')
  }

  return (
    <div className="mt-8 space-y-6">
      <OptionRow label="Length">
        {lengths.map((option) => (
          <OptionButton key={option} active={option === length} onClick={() => chooseLength(option)}>
            {option}&quot;
          </OptionButton>
        ))}
      </OptionRow>

      {hairTypes.length > 0 ? (
        <OptionRow label="Hair type">
          {hairTypes.map((option) => (
            <OptionButton
              key={option}
              active={option === selectedHairType}
              onClick={() => setHairType(option)}
            >
              {HAIR_TYPE_LABELS[option]}
            </OptionButton>
          ))}
        </OptionRow>
      ) : null}

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
            hairType: selected.hairType,
            price: selected.price,
            shopifyProductId: shopifyProductId || undefined,
            shopifyVariantId: selected.shopifyVariantId || undefined,
          })
        }
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected.inStock === false
          ? 'Currently restocking'
          : `Add ${selected.length}" ${HAIR_TYPE_LABELS[selected.hairType]}`}
      </button>
    </div>
  )
}

function OptionRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] tracking-[0.19em] uppercase text-ink/60">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2 font-mono text-[10px] tracking-[0.16em] uppercase transition ${
        active
          ? 'border-primary bg-primary text-canvas'
          : 'border-primary/30 bg-transparent text-ink hover:border-primary'
      }`}
    >
      {children}
    </button>
  )
}
