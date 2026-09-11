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
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        {heading ? (
          <h2 className="display mb-10 max-w-2xl text-5xl md:text-7xl">{heading}</h2>
        ) : null}
      </div>
      <div className="carousel-track">
        {items.map((product) => (
          <div key={product._id} className="min-w-[78%] snap-start sm:min-w-[46%] lg:min-w-[30%]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
