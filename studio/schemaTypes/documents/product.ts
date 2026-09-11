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
        rule.min(1).max(2).custom((variants) => {
          const lengths = (variants || []).map((variant) => variant?.length).filter(Boolean)
          if (new Set(lengths).size !== lengths.length) {
            return 'Each length can only be used once'
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
    },
    prepare({title, media, variant0, variant1}) {
      const lengths = [variant0, variant1].filter(Boolean).map((length) => `${length}"`)
      return {
        title,
        subtitle: lengths.length ? lengths.join(' · ') : 'No lengths',
        media,
      }
    },
  },
})
