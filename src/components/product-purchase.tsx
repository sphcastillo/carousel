'use client'

import {useMemo, useState, type ReactNode} from 'react'
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

  const selectedHairType = hairTypes.includes(hairType) ? hairType : hairTypes[0]
  const selected =
    available.find(
      (variant) =>
        (selectedOption ? variant.length === selectedOption : true) &&
        (selectedHairType ? variant.hairType === selectedHairType : true),
    ) || available[0]

  if (!selected) return null

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
            length: selectedOption || 'default',
            hairType: selectedHairType,
            price: selected.price,
            shopifyProductId: shopifyProductId || undefined,
            shopifyVariantId: selected.shopifyVariantId || undefined,
          })
        }
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected.inStock === false ? 'Currently restocking' : addLabel(selectedOption, selectedHairType, usesLength)}
      </button>
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
