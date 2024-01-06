import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'
import he from 'he'

export const getMany = async (req, res, next) => {
  try {
    const posts = await mongoose
      .model('Post')
      .find({})
      .populate('author', 'username')
      .sort({ createdAt: -1 })
    if (!posts) return res.status(404).json({ message: 'No posts found' })
    return res.status(200).json(posts)
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const post = await mongoose.model('Post').findById(req.params.id)
    return res.status(200).json(post)
  } catch (err) {
    res.status(500)
    next(err)
  }
}

// TODO: Import allowed tags from model and validate them
export const createOne = [
  body('title', 'Title is required').trim().notEmpty().escape(),
  body('description', 'Description is required').trim().notEmpty().escape(),
  body('imageUrl').trim().optional({ values: 'falsy' }).isURL(),
  body('imageCredit').trim().escape(),
  body('tags', 'Tags are required').trim().notEmpty().escape(),
  body('markdown', 'Markdown is required').trim().notEmpty(),
  body('isPublished')
    .optional({ values: undefined })
    .custom((value) => !!value),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg })
      }

      const { title, description, imageUrl, imageCredit, markdown, tags, isPublished } = req.body

      const author = await mongoose.model('User').findOne({ username: req.user })
      const tagsArray = tags.split(',')
      let sanitizedMarkdown = he.escape(markdown)

      const newPost = await mongoose.model('Post').create({
        author,
        title,
        description,
        imageUrl,
        imageCredit,
        markdown: sanitizedMarkdown,
        tags: tagsArray,
        isPublished,
      })
      return res.status(201).json(newPost)
    } catch (err) {
      res.status(500)
      next(err)
    }
  },
]

export const updateOne = [
  body('title', 'Title is required').trim().notEmpty().escape(),
  body('description', 'Description is required').trim().notEmpty().escape(),
  body('imageUrl').trim().optional({ values: 'falsy' }).isURL(),
  body('imageCredit').trim().escape(),
  body('tags', 'Tags are required').trim().notEmpty().escape(),
  body('markdown', 'Markdown is required').trim().notEmpty(),
  body('isPublished')
    .optional({ values: undefined })
    .custom((value) => !!value),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // console.log(errors)
        return res.status(400).json({ message: errors.array()[0].msg })
      }

      const { title, description, imageUrl, imageCredit, markdown, tags, isPublished } = req.body

      const tagsArray = tags.split(',')
      let sanitizedMarkdown = he.escape(markdown)

      const updatedPost = await mongoose
        .model('Post')
        .findByIdAndUpdate(
          req.params.id,
          {
            title,
            description,
            imageUrl,
            imageCredit,
            markdown: sanitizedMarkdown,
            tags: tagsArray,
            isPublished,
          },
          { new: true } // Return the updated document
        )
        .populate('author', 'username')

      return res.status(200).json(updatedPost)
    } catch (err) {
      res.status(500)
      next(err)
    }
  },
]

export const togglePublish = async (req, res, next) => {
  try {
    const updatedPost = await mongoose
      .model('Post')
      .findByIdAndUpdate(
        req.params.id,
        { isPublished: req.query.publish === 'true' },
        { new: true }
      )
      .populate('author', 'username')
      .exec()

    return res.status(200).json(updatedPost)
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id
    await mongoose.model('Post').findByIdAndDelete(id)
    return res.status(204).json('Message deleted')
  } catch (err) {
    res.status(500)
    next(err)
  }
}
