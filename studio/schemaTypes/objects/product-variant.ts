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
          {title: '22 inches', value: '22'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hairType',
      title: 'Hair type',
      type: 'string',
      initialValue: 'remy',
      options: {
        list: [
          {title: 'Remy Hair', value: 'remy'},
          {title: '100% Human Hair', value: 'human'},
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
    select: {length: 'length', hairType: 'hairType', price: 'price', sku: 'sku'},
    prepare({length, hairType, price, sku}) {
      const typeLabel = hairType === 'human' ? '100% Human Hair' : 'Remy Hair'
      return {
        title: `${length}" · ${typeLabel}`,
        subtitle: price ? `$${price}${sku ? ` · ${sku}` : ''}` : sku,
      }
    },
  },
})
