import {defineField, defineType} from 'sanity'
import {HeartIcon} from '@sanity/icons'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / location',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      type: 'altImage',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'quote', media: 'photo'},
  },
})
