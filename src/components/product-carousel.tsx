import {ProductCard, type ProductCardProduct} from './product-card'

export function ProductCarousel({
  heading,
  eyebrow,
  products,
}: {
  heading?: string | null
  eyebrow?: string | null
  products?: Array<ProductCardProduct | null> | null
}) {
  const items = (products || []).filter((product): product is ProductCardProduct => Boolean(product))

  if (!items.length) return null

  return (
    <section className="border-t border-primary/10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {eyebrow ? (
          <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">{eyebrow}</p>
        ) : null}
        {heading ? (
          <h2 className="mb-10 max-w-2xl font-display text-5xl leading-[0.78] tracking-[-0.04em] md:text-7xl">
            {heading}
          </h2>
        ) : null}
      </div>
      <div className="flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:px-8">
        {items.map((product) => (
          <div key={product._id} className="min-w-[78%] snap-start sm:min-w-[46%] lg:min-w-[30%]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
