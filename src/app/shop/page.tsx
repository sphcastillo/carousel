import type {Metadata} from 'next'
import {ProductCard} from '@/components/ProductCard'
import {sanityFetch} from '@/sanity/live'
import {PRODUCTS_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Clip-ins, wefts, and seamless sets in 18", 20", and 22".',
}

export default async function ShopPage() {
  const {data: products} = await sanityFetch({query: PRODUCTS_QUERY})

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] uppercase">The Lineup Awaits</p>
      <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">Shop the carousel</h1>
      {/* <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/70">
        Some sets live only in 18", some only in 20", and the favorites come in both.
      </p> */}

      <div className="mt-12 grid gap-6 grid-cols-2 lg:grid-cols-3">
        {(products || []).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
