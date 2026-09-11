import {defineField, defineType} from 'sanity'

export const productVariantType = defineType({
  name: 'productVariant',
  title: 'Product variant',
  type: 'object',
  fields: [
    defineField({
      name: 'length',
      type: 'string',
      options: {
        list: [
          {title: '18 inches', value: '18'},
          {title: '20 inches', value: '20'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price',
      type: 'number',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'inStock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'shopifyVariantId',
      title: 'Shopify variant ID',
      type: 'string',
      description: 'Optional GID for a future Storefront API checkout',
    }),
  ],
  preview: {
    select: {length: 'length', price: 'price', sku: 'sku'},
    prepare({length, price, sku}) {
      return {
        title: `${length}"`,
        subtitle: price ? `$${price}${sku ? ` · ${sku}` : ''}` : sku,
      }
    },
  },
})
