import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'portraitGallery'}),
    defineArrayMember({type: 'editorialSplit'}),
    defineArrayMember({type: 'productCarousel'}),
    defineArrayMember({type: 'testimonialsBlock'}),
    defineArrayMember({type: 'featuredIn'}),
    defineArrayMember({type: 'videoMoment'}),
    defineArrayMember({type: 'instagramStrip'}),
  ],
  options: {
    insertMenu: {
      views: [{name: 'grid'}],
    },
  },
})
