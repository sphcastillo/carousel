import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const PRODUCT_CATEGORIES = [
  {title: 'Carousel Ponytail', value: 'ponytail'},
  {title: 'Carousel Crown', value: 'crown'},
  {title: 'Carousel Merchandise', value: 'merchandise'},
] as const

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  PRODUCT_CATEGORIES.map((category) => [category.value, category.title]),
)

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: BasketIcon,

  fields: [
    defineField({
      name: 'store',
      title: 'Shopify product data',
      type: 'object',
      description: 'Managed automatically by Shopify.',
      readOnly: true,
      fields: [
        defineField({
          name: 'createdAt',
          type: 'datetime',
        }),
        defineField({
          name: 'shopifyTriggeredAt',
          type: 'datetime',
        }),
        defineField({
          name: 'descriptionHtml',
          title: 'Shopify description',
          type: 'text',
          rows: 5,
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
          name: 'isDeleted',
          type: 'boolean',
        }),
        defineField({
          name: 'options',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'option',
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  type: 'string',
                }),
                defineField({
                  name: 'values',
                  type: 'array',
                  of: [defineArrayMember({type: 'string'})],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: 'previewImageUrl',
          title: 'Preview image URL',
          type: 'url',
        }),
        defineField({
          name: 'priceRange',
          type: 'object',
          fields: [
            defineField({
              name: 'minVariantPrice',
              title: 'Minimum variant price',
              type: 'number',
            }),
            defineField({
              name: 'maxVariantPrice',
              title: 'Maximum variant price',
              type: 'number',
            }),
          ],
        }),
        defineField({
          name: 'productType',
          type: 'string',
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
          name: 'slug',
          type: 'slug',
        }),
        defineField({
          name: 'status',
          type: 'string',
        }),
        defineField({
          name: 'tags',
          type: 'string',
        }),
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'variants',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'reference',
              to: [{type: 'productVariant'}],
              weak: true,
            }),
          ],
        }),
        defineField({
          name: 'vendor',
          type: 'string',
        }),
      ],
    }),

    // Editable Carousel content
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Each product is a ponytail, a crown, or merchandise.',
      options: {
        list: [...PRODUCT_CATEGORIES],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortPitch',
      type: 'string',
      description: 'A short merchandising line for cards and carousels.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Editorial description',
      type: 'array',
      description:
        'Carousel website copy. This does not overwrite the Shopify description.',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'gallery',
      title: 'Editorial gallery',
      type: 'array',
      of: [defineArrayMember({type: 'altImage'})],
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'store.title',
      category: 'category',
      productType: 'store.productType',
      status: 'store.status',
      price: 'store.priceRange.minVariantPrice',
      media: 'gallery.0',
    },
    prepare({title, category, productType, status, price, media}) {
      const details = [
        category ? CATEGORY_LABELS[category] : undefined,
        productType,
        typeof price === 'number' ? `$${price}` : undefined,
        status,
      ].filter(Boolean)

      return {
        title: title || 'Untitled Shopify product',
        subtitle: details.join(' · '),
        media,
      }
    },
  },
})