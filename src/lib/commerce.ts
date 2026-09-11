export type LengthOption = '18' | '20'

export type CartLine = {
  id: string
  productId: string
  slug: string
  name: string
  imageUrl?: string
  imageAlt?: string
  length: LengthOption
  price: number
  quantity: number
  shopifyProductId?: string
  shopifyVariantId?: string
}

export function createLineId(productId: string, length: LengthOption) {
  return `${productId}:${length}`
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
