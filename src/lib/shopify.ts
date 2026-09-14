import 'server-only'
import type {ProductCardProduct} from '@/components/ProductCard'

type ShopifyProduct = {
  id: string
  title: string
  handle: string
  onlineStoreUrl: string | null
  featuredImage: {url: string; altText: string | null} | null
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}}
}

/** Uses Shopify's collection order and public Storefront API. */
export async function getCarouselFavorites(): Promise<ProductCardProduct[] | null> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim()
  if (!domain) return null
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) {
    throw new Error('SHOPIFY_STORE_DOMAIN must be a .myshopify.com hostname')
  }

  const handle = process.env.SHOPIFY_FAVORITES_COLLECTION_HANDLE || 'carousel-favorites'
  const products: ShopifyProduct[] = []
  let after: string | null = null
  do {
    const response = await fetch(`https://${domain}/api/2026-04/graphql.json`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        query: `query CarouselFavorites($handle: String!, $after: String) {
          collection(handle: $handle) {
            products(first: 50, after: $after, sortKey: COLLECTION_DEFAULT) {
              nodes {
                id title handle onlineStoreUrl
                featuredImage { url altText }
                priceRange { minVariantPrice { amount currencyCode } }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        }`,
        variables: {handle, after},
      }),
    })
    if (!response.ok) throw new Error(`Shopify collection request failed (${response.status})`)
    const payload = await response.json() as {
      errors?: Array<{message: string}>
      data?: {collection: {products: {
        nodes: ShopifyProduct[]
        pageInfo: {hasNextPage: boolean; endCursor: string | null}
      }} | null}
    }
    if (payload.errors?.length) throw new Error(payload.errors.map(({message}) => message).join('; '))
    if (!payload.data?.collection) throw new Error(`Shopify collection "${handle}" was not found or is not published`)
    const page = payload.data.collection.products
    products.push(...page.nodes)
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after)

  return products.map((product) => ({
    _id: product.id,
    name: product.title,
    slug: product.handle,
    href: product.onlineStoreUrl || `https://${domain}/products/${product.handle}`,
    imageUrl: product.featuredImage?.url,
    imageAlt: product.featuredImage?.altText || product.title,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    variants: [{price: Number(product.priceRange.minVariantPrice.amount)}],
  }))
}
