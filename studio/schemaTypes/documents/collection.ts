import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const collectionType = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: TagIcon,

  fields: [
    defineField({
      name: 'store',
      title: 'Shopify collection data',
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
          name: 'disjunctive',
          type: 'boolean',
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
          name: 'imageUrl',
          type: 'url',
        }),
        defineField({
          name: 'isDeleted',
          type: 'boolean',
        }),
        defineField({
          name: 'rules',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'column',
                  type: 'string',
                }),
                defineField({
                  name: 'condition',
                  type: 'string',
                }),
                defineField({
                  name: 'relation',
                  type: 'string',
                }),
              ],
            }),
          ],
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
          name: 'sortOrder',
          type: 'string',
        }),
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'updatedAt',
          type: 'datetime',
        }),
      ],
    }),

    // Editable Carousel content
    defineField({
      name: 'title',
      title: 'Editorial title',
      type: 'string',
      description: 'Optional override for the website.',
    }),
    defineField({
      name: 'slug',
      title: 'Editorial slug',
      type: 'slug',
      options: {
        source: (document) => {
          const editorialTitle =
            typeof document.title === 'string' ? document.title : undefined
      
          const store = document.store as {title?: unknown} | undefined
          const shopifyTitle =
            typeof store?.title === 'string' ? store.title : undefined
      
          return editorialTitle || shopifyTitle || ''
        },
      },
    }),
    defineField({
      name: 'description',
      title: 'Editorial description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
        }),
      ],
    }),
  ],

  preview: {
    select: {
      shopifyTitle: 'store.title',
      editorialTitle: 'title',
      status: 'store.isDeleted',
    },
    prepare({shopifyTitle, editorialTitle, status}) {
      return {
        title: editorialTitle || shopifyTitle || 'Untitled collection',
        subtitle: status ? 'Deleted in Shopify' : 'Shopify collection',
      }
    },
  },
})