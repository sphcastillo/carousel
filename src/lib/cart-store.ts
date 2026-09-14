'use client'

import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {createLineId, type CartLine} from '@/lib/commerce'

const STORAGE_KEY = 'carousel-cart-v2'

export type CartItemInput = Omit<CartLine, 'id' | 'quantity'>

type CartState = {
  lines: CartLine[]
  addItem: (line: CartItemInput, quantity?: number) => void
  setQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
}

const storage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(name)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return JSON.stringify({state: {lines: parsed}, version: 0})
      }
      return raw
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    window.localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    window.localStorage.removeItem(name)
  },
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (line, quantity = 1) => {
        const id = createLineId(line.productId, line.length, line.hairType)
        set((state) => {
          const existing = state.lines.find((item) => item.id === id)
          if (existing) {
            return {
              lines: state.lines.map((item) =>
                item.id === id ? {...item, quantity: item.quantity + quantity} : item,
              ),
            }
          }
          return {lines: [...state.lines, {...line, id, quantity}]}
        })
      },
      setQuantity: (id, quantity) => {
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((item) => item.id !== id)
              : state.lines.map((item) => (item.id === id ? {...item, quantity} : item)),
        }))
      },
      removeItem: (id) => {
        set((state) => ({
          lines: state.lines.filter((item) => item.id !== id),
        }))
      },
      clear: () => set({lines: []}),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({lines: state.lines}),
    },
  ),
)
