import type {Metadata} from 'next'
import {ProductCard} from '@/components/ProductCard'
import {SHOP_CATEGORIES} from '@/lib/product-categories'
import {sanityFetch} from '@/sanity/live'
import {PRODUCTS_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Clip-ins, wefts, and seamless sets in 18", 20", and 22".',
}

export default async function ShopPage() {
  const {data: products} = await sanityFetch({query: PRODUCTS_QUERY})
  const list = products || []
  const sections = SHOP_CATEGORIES.map((category) => ({
    ...category,
    products: list.filter((product) => String(product.category || '') === category.value),
  })).filter((section) => section.products.length > 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">The Lineup Awaits</p>
      <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">Shop the carousel</h1>

      {sections.length > 0 ? (
        <div className="mt-16 space-y-20">
          {sections.map((section) => (
            <section
              key={section.value}
              id={`shop-${section.value}`}
              className="scroll-mt-28"
              aria-labelledby={`shop-${section.value}-heading`}
            >
              <h2
                id={`shop-${section.value}-heading`}
                className="font-display text-4xl leading-[0.86] tracking-[-0.04em] md:text-6xl"
              >
                {section.title}
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
                {section.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
