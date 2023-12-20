import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import User from './user.js'
import Post from './post.js'
// import Comment from './comment'

const eraseDatabaseOnSync = true

export const connectDb = async () => {
  mongoose.connect(process.env.DATABASE_URL).then(async () => {
    if (eraseDatabaseOnSync) {
      const user = await User.findOne() // Only one user
      if (user) await user.deleteOne()
      populateDb()
    }
  })
}

const populateDb = async () => {
  const user = new User({
    username: 'columk',
    password: process.env.USER_PASSWORD,
    role: 'admin',
  })
  await user.save()

  // Fetch a blog post markdown file from github to seed the new post
  const url =
    'https://raw.githubusercontent.com/TheOdinProject/curriculum/main/react/the_react_ecosystem/react_router.md'
  const response = await fetch(url)
  const data = await response.text()

  const post = new Post({
    author: user.id,
    title: 'React Router',
    image_url:
      'https://www.theodinproject.com/assets/og-logo-dc2c719e367496ffaee876882b3f62c9b139279824de6a6e16448398fa513f7a.png',
    image_credit: 'https://www.theodinproject.com',
    markdown: data,
    tags: ['React'],
  })
  await post.save()
}
