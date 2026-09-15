export const PRODUCT_CATEGORY_LABELS = {
  ponytail: 'Carousel Ponytail',
  crown: 'Carousel Crown',
  merchandise: 'Carousel Merchandise',
} as const

export type ProductCategory = keyof typeof PRODUCT_CATEGORY_LABELS

export const SHOP_CATEGORIES: Array<{value: ProductCategory; title: string}> = [
  {value: 'ponytail', title: 'Carousel Ponytails'},
  {value: 'crown', title: 'Carousel Crowns'},
  {value: 'merchandise', title: 'Carousel Merchandise'},
]

export const SHOP_PONYTAILS_HREF = '/shop#shop-ponytail'

export function productCategoryLabel(category?: string | null) {
  if (!category || !(category in PRODUCT_CATEGORY_LABELS)) return null
  return PRODUCT_CATEGORY_LABELS[category as ProductCategory]
}
