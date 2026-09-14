'use client'

import {useCartStore} from '@/lib/cart-store'
import type {LengthOption} from '@/lib/commerce'

export function useCart() {
  const lines = useCartStore((state) => state.lines)
  const addItem = useCartStore((state) => state.addItem)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clear = useCartStore((state) => state.clear)

  return {
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    addItem,
    setQuantity,
    removeItem,
    clear,
  }
}

export function useOptionalLength(lengths: LengthOption[]): LengthOption {
  return lengths[0] || '18'
}
