import mongoose from 'mongoose'

export const getMany = async (req, res, next) => {
  try {
    const comments = await mongoose.model('Comment').find()
    return res.status(200).json({ data: comments })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const comment = await mongoose.model('Comment').findById(req.params.id)
    if (!comment) return res.status(400).json({ error: 'Invalid ID' })
    return res.status(200).json({ data: comment })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const createOne = async (req, res, next) => {
  try {
    const { author_name, title, text } = req.body
    const newComment = await mongoose.model('Comment').create({ author_name, title, text })
    return res.status(201).json({ data: newComment })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const deletedComment = await mongoose.model('Comment').findByIdAndDelete(id)
    res.status(200).json({ data: deletedComment })
  } catch (err) {
    res.status(500)
    next(err)
  }
}
