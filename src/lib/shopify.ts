import 'server-only'

import type {ProductCardProduct} from '@/components/ProductCard'
import type {CartLine} from '@/lib/commerce'

type ShopifyProduct = {
  id: string
  title: string
  handle: string
  featuredImage: {
    url: string
    altText: string | null
  } | null
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    nodes: Array<{
      id: string
      title: string
      price: {
        amount: string
        currencyCode: string
      }
      compareAtPrice: {
        amount: string
        currencyCode: string
      } | null
    }>
  }
}

export function getCarouselFavorites() {
  return getShopifyCollection(
    process.env.SHOPIFY_FAVORITES_COLLECTION_HANDLE || 'carousel-favorites',
  )
}

export function getCarouselPonytails() {
  return getShopifyCollection(
    process.env.SHOPIFY_PONYTAILS_COLLECTION_HANDLE || 'carousel-ponytails',
  )
}

export function getHalloweenEdit() {
  return getShopifyCollection(
    process.env.SHOPIFY_HALLOWEEN_COLLECTION_HANDLE || 'the-halloween-edit',
  )
}

export function getMerchandiseBesidesHalloween() {
  return getShopifyCollection(
    process.env.SHOPIFY_MERCHANDISE_COLLECTION_HANDLE || 'merchandise-besides-halloween',
  )
}

type CheckoutLine = Pick<CartLine, 'shopifyVariantId' | 'quantity' | 'name'>

export async function createShopifyCheckout(
  lines: CheckoutLine[],
): Promise<{checkoutUrl: string}> {
  if (!lines.length) {
    throw new Error('Your bag is empty.')
  }

  const missing = lines.filter((line) => !line.shopifyVariantId)
  if (missing.length) {
    const names = missing.map((line) => line.name || 'A product').join(', ')
    throw new Error(
      `${names} cannot be checked out. Remove ${missing.length === 1 ? 'it' : 'them'} and try again.`,
    )
  }

  const payload = await shopifyStorefrontGraphql<{
    cartCreate: {
      cart: {checkoutUrl: string} | null
      userErrors: Array<{field?: string[] | null; message: string}>
    }
  }>(
    `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        lines: lines.map((line) => ({
          merchandiseId: line.shopifyVariantId,
          quantity: line.quantity,
        })),
      },
    },
    {cache: 'no-store'},
  )

  const result = payload.cartCreate
  if (result.userErrors.length) {
    throw new Error(result.userErrors.map(({message}) => message).join('; '))
  }

  const checkoutUrl = result.cart?.checkoutUrl
  if (!checkoutUrl) {
    throw new Error('Shopify did not return a checkout URL.')
  }

  return {checkoutUrl}
}

/**
 * Gets products from a Shopify collection in the order configured in Shopify.
 */
type ShopifyCollectionPayload = {
  collection: {
    products: {
      nodes: ShopifyProduct[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: string | null
      }
    }
  } | null
}

export async function getShopifyCollection(
  handle: string,
): Promise<ProductCardProduct[]> {
  const products: ShopifyProduct[] = []
  let after: string | null = null

  do {
    const payload: ShopifyCollectionPayload = await shopifyStorefrontGraphql<ShopifyCollectionPayload>(
      `
        query ShopifyCollection(
          $handle: String!
          $after: String
        ) {
          collection(handle: $handle) {
            products(
              first: 50
              after: $after
              sortKey: COLLECTION_DEFAULT
            ) {
              nodes {
                id
                title
                handle

                featuredImage {
                  url
                  altText
                }

                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }

                variants(first: 30) {
                  nodes {
                    id
                    title

                    price {
                      amount
                      currencyCode
                    }

                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }

              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      {handle, after},
      {revalidate: 60},
    )

    if (!payload.collection) {
      throw new Error(
        `Shopify collection "${handle}" was not found or is not published`,
      )
    }

    const page = payload.collection.products
    products.push(...page.nodes)
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after)

  return products.map((product) => ({
    _id: product.id,
    name: product.title,
    slug: product.handle,

    // Keep customers inside the headless Next.js site.
    href: `/shop/${product.handle}`,

    imageUrl: product.featuredImage?.url || null,
    imageAlt:
      product.featuredImage?.altText || product.title,

    currencyCode:
      product.priceRange.minVariantPrice.currencyCode,

    variants: product.variants.nodes.map((variant) => ({
      _key: variant.id,
      length:
        variant.title === 'Default Title'
          ? null
          : variant.title,
      price: Number(variant.price.amount),
      compareAtPrice: variant.compareAtPrice
        ? Number(variant.compareAtPrice.amount)
        : null,
    })),
  }))
}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
  const token =
    process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN?.trim()
  const apiVersion =
    process.env.SHOPIFY_STOREFRONT_API_VERSION || '2026-07'

  if (!domain) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN')
  }

  if (!token) {
    throw new Error(
      'Missing SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN',
    )
  }

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) {
    throw new Error(
      'SHOPIFY_STORE_DOMAIN must be a .myshopify.com hostname',
    )
  }

  return {domain, token, apiVersion}
}

async function shopifyStorefrontGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: {cache?: RequestCache; revalidate?: number},
): Promise<T> {
  const {domain, token, apiVersion} = getShopifyConfig()

  const response = await fetch(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
      },
      cache: options?.cache,
      next:
        options?.revalidate != null
          ? {revalidate: options.revalidate}
          : undefined,
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({query, variables}),
    },
  )

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(
      `Shopify request failed (${response.status}): ${responseText}`,
    )
  }

  const payload = (await response.json()) as {
    errors?: Array<{message: string}>
    data?: T
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map(({message}) => message).join('; '))
  }

  if (!payload.data) {
    throw new Error('Shopify returned an empty response.')
  }

  return payload.data
}
