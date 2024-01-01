import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'
import he from 'he'

export const getMany = async (req, res, next) => {
  try {
    const posts = await mongoose.model('Post').find({}).populate('author', 'username')
    if (!posts) return res.status(404).json({ message: 'No posts found' })
    return res.status(200).json({ data: posts })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const post = await mongoose.model('Post').findById(req.params.id)
    return res.status(200).json({ data: post })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const createOne = [
  body('title', 'Title is required').trim().notEmpty().escape(),
  body('description', 'Description is required').trim().notEmpty().escape(),
  body('markdown', 'Markdown is required').trim().notEmpty().escape(),
  body('isPublished')
    .optional({ values: undefined })
    .custom((value) => !!value),

  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
      }

      const { title, description, imageUrl, imageCredit, markdown, tags, isPublished } = req.body
      const tagsArray = tags.split(',')
      const author = await mongoose.model('User').findOne({ username: req.user })
      let sanitizedMarkdown = he.escape(markdown)
      const newPost = await mongoose.model('Post').create({
        author,
        title,
        description,
        image_url: imageUrl,
        image_credit: imageCredit,
        // markdown,
        markdown: sanitizedMarkdown,
        tags: tagsArray,
        is_published: isPublished,
      })
      return res.status(201).json({ data: newPost })
    } catch (err) {
      res.status(500)
      next(err)
    }
  },
]

export const updateOne = async (req, res, next) => {
  try {
    const id = req.params.id
    let post = await mongoose.model('Post').findById(id)
    post.set(req.body)
    const updatedPost = await post.save()
    return res.status(200).json({ data: updatedPost })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const deleteOne = async (res, req, next) => {
  try {
    const id = req.params.id
    const deletedPost = await mongoose.model('Post').findByIdAndDelete(id)
    return res.status(200).json({ data: deletedPost })
  } catch (err) {
    res.status(500)
    next(err)
  }
}
