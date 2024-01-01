import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

// prettier-ignore
export const categories = ['JavaScript', 'HTML', 'CSS', 'React', 'NodeJS', 'Express', 'MongoDB', 'PassportJS', 'Career', 'Animation','Other']

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Author is required'] },
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    imageUrl: { type: String },
    image_credit: { type: String },
    markdown: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: [{ type: String, enum: categories }],
    comment_count: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    readingLength: { type: Number },
    sanitizedHtml: { type: String },
    formattedDate: { type: String },
  },
  { timestamps: true }
  // { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

postSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title)
  }
  if (this.markdown) {
    // this.sanitized_html = dompurify.sanitize(marked.parse(this.markdown))
    this.readingLength = Math.ceil(this.markdown.split(/\b\w+\b/g).length / 200)
  }
  next()
})

postSchema.pre('save', function (next) {
  this.formattedDate = this.createdAt
    ? DateTime.fromJSDate(this.createdAt).toLocaleString({
        month: 'short',
        day: '2-digit',
      })
    : ''
  next()
})

// postSchema.virtual('formatted_date').get(function () {
//   return this.createdAt ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED) : ''
// })

function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

const Post = model('Post', postSchema)

export default Post

// import { Marked } from 'marked'
// import { markedHighlight } from 'marked-highlight'
// import hljs from 'highlight.js'
// import createDomPurify from 'dompurify'
// import { JSDOM } from 'jsdom'

// const dompurify = createDomPurify(new JSDOM().window)

// const marked = new Marked(
//   markedHighlight({
//     langPrefix: 'hljs language-',
//     highlight(code, lang, info) {
//       const language = hljs.getLanguage(lang) ? lang : 'plaintext'
//       return hljs.highlight(code, { language }).value
//     },
//   })
// )
