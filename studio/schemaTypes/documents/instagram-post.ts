import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const instagramPostType = defineType({
  name: 'instagramPost',
  title: 'Instagram post',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'kind',
      type: 'string',
      initialValue: 'photo',
      options: {
        list: [
          {title: 'Photo', value: 'photo'},
          {title: 'Note', value: 'note'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Tile kicker, e.g. LOOK, OBJECT, NOTE, SCENE.',
    }),
    defineField({
      name: 'image',
      type: 'altImage',
      hidden: ({parent}) => parent?.kind === 'note',
      validation: (rule) =>
        rule.custom((value, context) => {
          const kind = (context.parent as {kind?: string} | undefined)?.kind
          if (kind === 'note') return true
          return value ? true : 'Photo posts need an image'
        }),
    }),
    defineField({
      name: 'caption',
      type: 'text',
      rows: 3,
      description: 'Shown as the quote on a note tile, or as supporting copy on a photo.',
    }),
    defineField({
      name: 'permalink',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'caption', subtitle: 'label', kind: 'kind', media: 'image'},
    prepare({title, subtitle, kind, media}) {
      return {
        title: title || subtitle || 'Instagram post',
        subtitle: [kind, subtitle].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
