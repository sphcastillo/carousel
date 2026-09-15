'use client'

import Link from 'next/link'
import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react'
import {
  formatMoney,
  HAIR_TYPE_LABELS,
  isHairTypeOption,
  isLengthOption,
  parseLengthOption,
  type HairTypeOption,
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
  optionName = 'Length',
  variants,
}: {
  productId: string
  name: string
  slug: string
  imageUrl?: string
  imageAlt?: string
  shopifyProductId?: string | null
  optionName?: string | null
  variants: Variant[]
}) {
  const available = useMemo(
    () => variants.filter((variant): variant is Variant & {price: number} => typeof variant.price === 'number'),
    [variants],
  )
  const optionValues = useMemo(() => {
    const values = available
      .map((variant) => variant.length)
      .filter((value): value is string => Boolean(value && value !== 'Default Title'))
    return [...new Set(values)]
  }, [available])
  const usesLength = optionValues.some((value) => parseLengthOption(value))
  const [option, setOption] = useState(optionValues[0] || '')
  const selectedOption = optionValues.includes(option) ? option : optionValues[0] || ''
  const hairTypes = useMemo(
    () =>
      [
        ...new Set(
          available
            .filter((variant) => !selectedOption || variant.length === selectedOption)
            .map((variant) => variant.hairType)
            .filter(isHairTypeOption),
        ),
      ],
    [available, selectedOption],
  )
  const [hairType, setHairType] = useState<HairTypeOption>(hairTypes[0] || 'remy')
  const {addItem} = useCart()
  const [toastDetail, setToastDetail] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedHairType = hairTypes.includes(hairType) ? hairType : hairTypes[0]
  const selected =
    available.find(
      (variant) =>
        (selectedOption ? variant.length === selectedOption : true) &&
        (selectedHairType ? variant.hairType === selectedHairType : true),
    ) || available[0]

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    },
    [],
  )

  if (!selected) return null

  function addSelectedToCart() {
    addItem({
      productId,
      slug,
      name,
      imageUrl,
      imageAlt,
      length: selectedOption || 'default',
      hairType: selectedHairType,
      price: selected.price,
      shopifyProductId: shopifyProductId || undefined,
      shopifyVariantId: selected.shopifyVariantId || undefined,
    })

    const details = [
      selectedOption && selectedOption !== 'default' ? selectedOption : null,
      selectedHairType ? HAIR_TYPE_LABELS[selectedHairType] : null,
    ].filter(Boolean)
    setToastDetail(details.join(' · ') || 'Added to your bag')

    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastDetail(null), 4000)
  }

  return (
    <div className="mt-8 space-y-6">
      {optionValues.length > 0 ? (
        <OptionRow label={usesLength ? 'Length' : optionName || 'Option'}>
          {optionValues.map((value) => (
            <OptionButton key={value} active={value === selectedOption} onClick={() => setOption(value)}>
              {usesLength && isLengthOption(parseLengthOption(value)) ? `${parseLengthOption(value)}"` : value}
            </OptionButton>
          ))}
        </OptionRow>
      ) : null}

      {hairTypes.length > 0 ? (
        <OptionRow label="Hair type">
          {hairTypes.map((value) => (
            <OptionButton key={value} active={value === selectedHairType} onClick={() => setHairType(value)}>
              {HAIR_TYPE_LABELS[value]}
            </OptionButton>
          ))}
        </OptionRow>
      ) : null}

      <div className="flex items-end gap-3">
        <p className="font-display text-[clamp(2rem,6vw,2.5rem)] md:text-4xl">{formatMoney(selected.price)}</p>
        {selected.compareAtPrice ? (
          <p className="pb-1 text-sm text-ink/45 line-through">{formatMoney(selected.compareAtPrice)}</p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={selected.inStock === false}
        onClick={addSelectedToCart}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected.inStock === false ? 'Currently restocking' : addLabel(selectedOption, selectedHairType, usesLength)}
      </button>

      {toastDetail ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed right-4 bottom-4 z-70 w-[min(22rem,calc(100vw-2rem))] border border-secondary/45 bg-ink px-5 py-5 text-canvas shadow-2xl motion-safe:animate-toast-in sm:right-6 sm:bottom-6"
        >
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToastDetail(null)}
            className="absolute top-3 right-3 grid size-7 place-items-center rounded-full border border-canvas/30 font-mono text-sm text-canvas/75 transition hover:bg-canvas hover:text-ink"
          >
            <span aria-hidden>×</span>
          </button>
          <p className="font-mono text-[0.58rem] tracking-[0.22em] text-secondary uppercase">
            Added to your bag
          </p>
          <p className="mt-2 pr-7 font-display text-2xl leading-tight">{name}</p>
          <p className="mt-1 font-mono text-[0.6rem] tracking-[0.12em] text-canvas/65 uppercase">
            {toastDetail}
          </p>
          <Link
            href="/cart"
            className="mt-4 inline-flex border-b border-secondary/60 pb-0.5 font-mono text-[0.6rem] tracking-[0.18em] text-secondary uppercase transition hover:border-canvas hover:text-canvas"
          >
            View bag
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function addLabel(option: string, hairType: HairTypeOption | undefined, usesLength: boolean) {
  const parts = [
    usesLength && parseLengthOption(option) ? `${parseLengthOption(option)}"` : option && option !== 'default' ? option : null,
    hairType ? HAIR_TYPE_LABELS[hairType] : null,
  ].filter(Boolean)
  return parts.length ? `Add ${parts.join(' ')}` : 'Add to bag'
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
