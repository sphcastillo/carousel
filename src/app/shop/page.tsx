import type {Metadata} from 'next'
import {ProductCard} from '@/components/product-card'
import {sanityFetch} from '@/sanity/live'
import {COLLECTIONS_QUERY, PRODUCTS_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Clip-ins, wefts, and seamless sets in 18" and 20".',
}

export default async function ShopPage() {
  const [{data: products}, {data: collections}] = await Promise.all([
    sanityFetch({query: PRODUCTS_QUERY}),
    sanityFetch({query: COLLECTIONS_QUERY}),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">01 / The boutique</p>
      <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">Shop the carousel</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/70">
        Some sets live only in 18", some only in 20", and the favorites come in both.
      </p>

      {collections && collections.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-3">
          {collections.map((collection) => (
            <a
              key={collection._id}
              href={`#${collection.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-primary px-[1.35rem] py-[0.85rem] font-mono text-[10px] tracking-[0.19em] text-primary uppercase transition hover:bg-primary hover:text-canvas"
            >
              {collection.title}
            </a>
          ))}
        </div>
      ) : null}

      {collections && collections.length > 0 ? (
        collections.map((collection) => (
          <section key={collection._id} id={collection.slug || undefined} className="mt-20">
            <h2 className="font-display text-4xl leading-[0.78] tracking-[-0.04em] md:text-5xl">{collection.title}</h2>
            {collection.description ? (
              <p className="mt-3 max-w-xl text-sm text-ink/65">{collection.description}</p>
            ) : null}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(collection.products || []).map((product) =>
                product ? <ProductCard key={product._id} product={product} /> : null,
              )}
            </div>
          </section>
        ))
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
