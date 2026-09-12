export const LENGTH_OPTIONS = ['18', '20', '22'] as const
export type LengthOption = (typeof LENGTH_OPTIONS)[number]

export function isLengthOption(value: string | null | undefined): value is LengthOption {
  return LENGTH_OPTIONS.includes(value as LengthOption)
}

export const HAIR_TYPE_OPTIONS = ['remy', 'human'] as const
export type HairTypeOption = (typeof HAIR_TYPE_OPTIONS)[number]

export const HAIR_TYPE_LABELS: Record<HairTypeOption, string> = {
  remy: 'Remy Hair',
  human: '100% Human Hair',
}

export function isHairTypeOption(value: string | null | undefined): value is HairTypeOption {
  return HAIR_TYPE_OPTIONS.includes(value as HairTypeOption)
}

export function resolveHairType(value: string | null | undefined): HairTypeOption {
  return isHairTypeOption(value) ? value : 'remy'
}

export type CartLine = {
  id: string
  productId: string
  slug: string
  name: string
  imageUrl?: string
  imageAlt?: string
  length: LengthOption
  hairType: HairTypeOption
  price: number
  quantity: number
  shopifyProductId?: string
  shopifyVariantId?: string
}

export function createLineId(productId: string, length: LengthOption, hairType: HairTypeOption) {
  return `${productId}:${length}:${hairType}`
}

/** Swap this later for a Shopify Storefront API cart create / checkout URL. */
export function getCheckoutAction(): {kind: 'coming-soon'; href: string; label: string} {
  return {
    kind: 'coming-soon',
    href: '/contact?intent=order',
    label: 'Request this order',
  }
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}
