'use server'

import {createShopifyCheckout} from '@/lib/shopify'
import type {CartLine} from '@/lib/commerce'

export async function startShopifyCheckout(
  lines: Array<Pick<CartLine, 'shopifyVariantId' | 'quantity' | 'name'>>,
): Promise<{checkoutUrl?: string; error?: string}> {
  try {
    const {checkoutUrl} = await createShopifyCheckout(lines)
    return {checkoutUrl}
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Checkout could not be started. Try again.',
    }
  }
}
