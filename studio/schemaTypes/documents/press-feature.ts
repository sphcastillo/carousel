import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const pressFeatureType = defineType({
  name: 'pressFeature',
  title: 'Press feature',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'publication',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'altImage',
    }),
    defineField({
      name: 'url',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'publication', media: 'logo'},
  },
})
