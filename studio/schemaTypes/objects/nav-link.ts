import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const navLinkType = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'internalPath',
      type: 'string',
      description: 'Path on this site, e.g. /shop',
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {title: 'label', linkType: 'linkType', internalPath: 'internalPath', externalUrl: 'externalUrl'},
    prepare({title, linkType, internalPath, externalUrl}) {
      return {
        title: title || 'Untitled link',
        subtitle: linkType === 'external' ? externalUrl : internalPath,
      }
    },
  },
})
