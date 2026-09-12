import {defineArrayMember, defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortPitch',
      type: 'string',
      description: 'One-line merchandising line for cards and carousels',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [defineArrayMember({type: 'altImage'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'variants',
      type: 'array',
      of: [defineArrayMember({type: 'productVariant'})],
      validation: (rule) =>
        rule.min(1).max(6).custom((variants) => {
          const items = (variants || []) as Array<{length?: string; hairType?: string} | undefined>
          const keys = items
            .map((variant) =>
              variant?.length ? `${variant.length}:${variant.hairType || 'remy'}` : null,
            )
            .filter(Boolean)
          if (new Set(keys).size !== keys.length) {
            return 'Each length and hair type pair can only be used once'
          }
          return true
        }),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'shopifyProductId',
      title: 'Shopify product ID',
      type: 'string',
      description: 'Optional GID so a future Storefront API checkout can map this product',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'gallery.0',
      variant0: 'variants.0.length',
      variant1: 'variants.1.length',
      variant2: 'variants.2.length',
      type0: 'variants.0.hairType',
      type1: 'variants.1.hairType',
      type2: 'variants.2.hairType',
    },
    prepare({title, media, variant0, variant1, variant2, type0, type1, type2}) {
      const pairs = [
        [variant0, type0],
        [variant1, type1],
        [variant2, type2],
      ]
        .filter(([length]) => Boolean(length))
        .map(([length, hairType]) => {
          const typeLabel = hairType === 'human' ? 'Human' : 'Remy'
          return `${length}" ${typeLabel}`
        })
      return {
        title,
        subtitle: pairs.length ? pairs.join(' · ') : 'No variants',
        media,
      }
    },
  },
})
