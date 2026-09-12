'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createLineId,
  type CartLine,
  type LengthOption,
} from '@/lib/commerce'

const STORAGE_KEY = 'carousel-cart-v2'

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  addItem: (line: Omit<CartLine, 'id' | 'quantity'>, quantity?: number) => void
  setQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({children}: {children: React.ReactNode}) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(readCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, ready])

  const addItem = useCallback((line: Omit<CartLine, 'id' | 'quantity'>, quantity = 1) => {
    const id = createLineId(line.productId, line.length, line.hairType)
    setLines((current) => {
      const existing = current.find((item) => item.id === id)
      if (existing) {
        return current.map((item) =>
          item.id === id ? {...item, quantity: item.quantity + quantity} : item,
        )
      }
      return [...current, {...line, id, quantity}]
    })
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? {...item, quantity} : item)),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setLines((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(
    () => ({
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [addItem, clear, lines, removeItem, setQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function useOptionalLength(lengths: LengthOption[]): LengthOption {
  return lengths[0] || '18'
}
