import { Schema, model } from 'mongoose'
import { DateTime } from 'luxon'

// prettier-ignore
export const categories = ['JavaScript', 'HTML', 'CSS', 'React', 'NodeJS', 'Express', 'MongoDB', 'PassportJS', 'Career', 'Animation', 'Typescript', 'NextJS', 'Personal', 'Prisma', 'Other']

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Author is required'] },
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    imageUrl: { type: String },
    imageCredit: { type: String },
    markdown: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: [{ type: String, enum: categories }],
    commentCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    readingLength: { type: Number },
    sanitizedHtml: { type: String },
    formattedDate: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, versionKey: false }
)

postSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title)
  }
  if (this.markdown) {
    this.readingLength = Math.ceil(this.markdown.split(/\b\w+\b/g).length / 200)
  }
  next()
})

// Pre-update hook to update the readingLength
postSchema.pre('findOneAndUpdate', function (next) {
  if (this.getUpdate().markdown) {
    const newReadingLength = Math.ceil(this.getUpdate().markdown.split(/\b\w+\b/g).length / 200)
    const newSlug = slugify(this.getUpdate().title)
    this.updateOne(
      {},
      {
        $set: {
          readingLength: newReadingLength,
          slug: newSlug,
        },
      }
    )
  }
  next()
})

postSchema.pre('save', function (next) {
  this.formattedDate = this.createdAt
    ? DateTime.fromJSDate(this.createdAt).toLocaleString({
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : ''
  next()
})

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
