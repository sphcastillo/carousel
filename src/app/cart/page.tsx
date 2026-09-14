'use client'

import {useState} from 'react'
import Link from 'next/link'
import {formatMoney, HAIR_TYPE_LABELS, isLengthOption, parseLengthOption} from '@/lib/commerce'
import {useCart} from '@/components/cart-provider'
import {startShopifyCheckout} from './actions'

export default function CartPage() {
  const {lines, subtotal, setQuantity, removeItem} = useCart()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  async function checkout() {
    setCheckoutError(null)
    setCheckingOut(true)
    try {
      const result = await startShopifyCheckout(
        lines.map((line) => ({
          shopifyVariantId: line.shopifyVariantId,
          quantity: line.quantity,
          name: line.name,
        })),
      )
      if (result.error || !result.checkoutUrl) {
        setCheckoutError(result.error || 'Checkout could not be started. Try again.')
        return
      }
      window.location.assign(result.checkoutUrl)
    } catch {
      setCheckoutError('Checkout could not be started. Try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-[radial-gradient(circle_at_12%_0%,color-mix(in_srgb,var(--secondary)_45%,transparent),transparent_34%),var(--canvas)] px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Your shopping bag</p>
        <h1 className="font-display text-6xl leading-[0.78] tracking-[-0.04em] md:text-8xl">The Cart</h1>
        <div className="mt-8 h-px max-w-xs bg-primary/22" />

        {lines.length === 0 ? (
          <div className="mt-16 max-w-lg border border-primary/18 bg-surface p-[1.6rem]">
            <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Empty</p>
            <p className="font-display text-5xl leading-[0.78] tracking-[-0.04em]">Nothing here yet.</p>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Your vanity is waiting for a little extra length.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-primary px-[1.35rem] py-[0.85rem] font-mono text-[10px] tracking-[0.19em] text-primary uppercase transition hover:bg-primary hover:text-canvas"
            >
              Wander the shop
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
                  <div className="border border-primary/18 bg-surface p-[0.55rem] pb-[0.7rem]">
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
                      {lineDetails(line.length, line.hairType) ? (
                        <p className="mt-1 font-mono text-[10px] tracking-[0.16em] uppercase text-ink/60">
                          {lineDetails(line.length, line.hairType)}
                        </p>
                      ) : null}
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
            <aside className="h-fit border border-primary/18 bg-surface p-[1.6rem]">
              <p className="mb-3.5 font-mono text-[10px] tracking-[0.19em] text-primary uppercase">Summary</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-display text-3xl">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                You will finish payment on Shopify's secure checkout.
              </p>
              {checkoutError ? (
                <p className="mt-4 text-sm leading-relaxed text-primary">{checkoutError}</p>
              ) : null}
              <button
                type="button"
                disabled={checkingOut}
                onClick={checkout}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-[1.4rem] py-4 font-mono text-[0.7rem] tracking-[0.18em] text-canvas uppercase disabled:opacity-60"
              >
                {checkingOut ? 'Sending to checkout' : 'Checkout'}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function lineDetails(length: string, hairType?: keyof typeof HAIR_TYPE_LABELS) {
  const parts = [
    length && length !== 'default'
      ? isLengthOption(parseLengthOption(length))
        ? `${parseLengthOption(length)}"`
        : length
      : null,
    hairType ? HAIR_TYPE_LABELS[hairType] : null,
  ].filter(Boolean)
  return parts.join(' · ')
}
