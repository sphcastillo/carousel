import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const instagramPostType = defineType({
  name: 'instagramPost',
  title: 'Instagram post',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'altImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
    defineField({
      name: 'permalink',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'caption', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Instagram post', media}
    },
  },
})
