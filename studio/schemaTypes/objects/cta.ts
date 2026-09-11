import {defineField, defineType} from 'sanity'
import {LaunchIcon} from '@sanity/icons'

export const ctaType = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  icon: LaunchIcon,
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
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
})
