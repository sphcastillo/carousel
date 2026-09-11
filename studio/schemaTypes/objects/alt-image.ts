import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const altImageType = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      validation: (rule) => rule.required().warning('Alt text is important for SEO'),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      description: 'Optional overlay label, like Soft focus',
    }),
  ],
})
