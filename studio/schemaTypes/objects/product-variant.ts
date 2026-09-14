import {defineField, defineType} from 'sanity'

export const productVariantType = defineType({
  name: 'productVariant',
  title: 'Shopify product variant',
  type: 'document',

  fields: [
    defineField({
      name: 'store',
      title: 'Shopify variant data',
      type: 'object',
      description: 'Managed automatically by Shopify.',
      readOnly: true,
      fields: [
        defineField({
          name: 'barcode',
          type: 'string',
        }),
        defineField({
          name: 'compareAtPrice',
          type: 'number',
        }),
        defineField({
          name: 'createdAt',
          type: 'datetime',
        }),
        defineField({
          name: 'gid',
          title: 'Shopify GID',
          type: 'string',
        }),
        defineField({
          name: 'id',
          title: 'Shopify ID',
          type: 'number',
        }),
        defineField({
          name: 'inventory',
          type: 'object',
          fields: [
            defineField({
              name: 'isAvailable',
              type: 'boolean',
            }),
            defineField({
              name: 'policy',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'isDeleted',
          type: 'boolean',
        }),
        defineField({
          name: 'option1',
          type: 'string',
        }),
        defineField({
          name: 'option2',
          type: 'string',
        }),
        defineField({
          name: 'option3',
          type: 'string',
        }),
        defineField({
          name: 'previewImageUrl',
          title: 'Preview image URL',
          type: 'url',
        }),
        defineField({
          name: 'price',
          type: 'number',
        }),
        defineField({
          name: 'productGid',
          title: 'Shopify product GID',
          type: 'string',
        }),
        defineField({
          name: 'productId',
          title: 'Shopify product ID',
          type: 'number',
        }),
        defineField({
          name: 'shop',
          type: 'object',
          fields: [
            defineField({
              name: 'domain',
              type: 'string',
            }),
          ],
        }),
        defineField({
          name: 'sku',
          title: 'SKU',
          type: 'string',
        }),
        defineField({
          name: 'status',
          type: 'string',
        }),
        defineField({
          name: 'title',
          type: 'string',
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'store.title',
      sku: 'store.sku',
      price: 'store.price',
      available: 'store.inventory.isAvailable',
    },
    prepare({title, sku, price, available}) {
      const details = [
        sku,
        typeof price === 'number' ? `$${price}` : undefined,
        available === false ? 'Unavailable' : undefined,
      ].filter(Boolean)

      return {
        title: title || 'Shopify variant',
        subtitle: details.join(' · '),
      }
    },
  },
})