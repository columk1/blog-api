import mongoose from 'mongoose'

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

export const createOne = async (req, res, next) => {
  try {
    const { title, image_url, image_credit, content, tags } = req.body
    const author = req.user
    const newPost = await mongoose.model('Post').create({
      author,
      title,
      image_url,
      image_credit,
      content,
      tags,
    })
    return res.status(201).json({ data: newPost })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

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
