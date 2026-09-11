'use client'

import Link from 'next/link'
import {formatMoney, getCheckoutAction} from '@/lib/commerce'
import {useCart} from '@/components/cart-provider'

export default function CartPage() {
  const {lines, subtotal, setQuantity, removeItem} = useCart()
  const checkout = getCheckoutAction()

  return (
    <div className="vanity-page min-h-[80vh] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">01 / Your bag</p>
        <h1 className="display text-6xl md:text-8xl">The Cart</h1>
        <div className="hairline mt-8 max-w-xs" />

        {lines.length === 0 ? (
          <div className="perfume-card mt-16 max-w-lg">
            <p className="kicker">Empty</p>
            <p className="display text-5xl">Nothing here yet.</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Your vanity is waiting for a little extra length.
            </p>
            <Link href="/shop" className="btn-round mt-8">
              Wander the boutique
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="space-y-5">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="grid grid-cols-[7.5rem_1fr] gap-4 border border-primary/15 bg-surface p-4 md:grid-cols-[9rem_1fr]"
                >
                  <div className="photo-figure">
                    {line.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={line.imageUrl}
                        alt={line.imageAlt || line.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/5] bg-secondary/40" />
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <Link href={`/shop/${line.slug}`} className="font-display text-3xl">
                        {line.name}
                      </Link>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
                        {line.length}&quot; set
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-primary/30"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{line.quantity}</span>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full border border-primary/30"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-display text-2xl">{formatMoney(line.price * line.quantity)}</p>
                      <button
                        type="button"
                        className="font-mono text-[10px] tracking-[0.16em] uppercase underline"
                        onClick={() => removeItem(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="perfume-card h-fit">
              <p className="kicker">Summary</p>
              <p className="display text-4xl">A little restraint.</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-display text-3xl">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                Shopify checkout is waiting in the wings. For now, send the studio your bag.
              </p>
              <Link href={checkout.href} className="btn-fill mt-6 w-full">
                {checkout.label}
              </Link>
              <p className="mt-4 text-center font-mono text-[10px] tracking-[0.18em] uppercase text-ink/40">
                Shopify checkout coming soon
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
