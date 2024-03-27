import mongoose from 'mongoose'
import he from 'he'
import dotenv from 'dotenv'
dotenv.config()

import User from './user.js'
import Post from './post.js'
// import Comment from './comment'

// Set to false when testing CRUD operations
const eraseDatabaseOnSync = process.env.NODE_ENV === 'development'

const devDbUri =
  'mongodb+srv://admin:5j1JipXE7inXLEpa@cluster0.mzawhit.mongodb.net/?retryWrites=true&w=majority'

const mongoUri = process.env.DATABASE_URL || devDbUri

export const connectDb = async () => {
  mongoose.connect(mongoUri || devDbUri).then(async () => {
    if (eraseDatabaseOnSync) {
      const user = await User.findOne() // Only one user, no query required
      if (user) await user.deleteOne() // Removes user and all posts linked to user
      populateDb()
    }
  })
}

const populateDb = async () => {
  const user = new User({
    username: 'columk',
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  })
  await user.save()

  // Fetch a blog post markdown file from github to seed the new post
  const url1 =
    'https://raw.githubusercontent.com/TheOdinProject/curriculum/main/react/the_react_ecosystem/react_router.md'
  const response1 = await fetch(url1)
  let data1 = await response1.text()
  data1 = he.escape(data1)
  // console.log(data)
  // const data = await response.text()

  const url2 =
    'https://raw.githubusercontent.com/TheOdinProject/curriculum/main/intermediate_html_css/grid/using_flexbox_and_grid.md'
  const response2 = await fetch(url2)
  let data2 = await response2.text()
  data2 = he.escape(data2)

  const url3 =
    'https://raw.githubusercontent.com/TheOdinProject/curriculum/main/nodeJS/authentication/authentication_basics.md'
  const response3 = await fetch(url3)
  let data3 = await response3.text()
  data3 = he.escape(data3)

  const post = new Post({
    author: user.id,
    title: 'React Router',
    description:
      'Learn the basics of the React Router library and how to use it in your next project.',
    imageUrl:
      'https://www.theodinproject.com/assets/og-logo-dc2c719e367496ffaee876882b3f62c9b139279824de6a6e16448398fa513f7a.png',
    imageCredit: 'https://www.theodinproject.com',
    markdown: data1,
    tags: ['React', 'JavaScript'],
  })
  await post.save()

  const post2 = new Post({
    author: user.id,
    title: 'Using Flexbox and Grid',
    description:
      'Flexbox and Grid are two of the most powerful CSS layout properties you can use. In this article, you will learn how to use both to create beautiful andresponsive layouts.',
    imageUrl:
      'https://www.theodinproject.com/assets/og-logo-dc2c719e367496ffaee876882b3f62c9b139279824de6a6e16448398fa513f7a.png',
    imageCredit: 'https://www.theodinproject.com',
    markdown: data2,
    tags: ['HTML', 'CSS'],
  })
  await post2.save()

  const post3 = new Post({
    author: user.id,
    title: 'Authentication Basics',
    description:
      'Authentication can be a complex topic. In this article, you will learn how to create a simple authentication system using Passport.js and MongoDB.',
    imageUrl:
      'https://www.theodinproject.com/assets/og-logo-dc2c719e367496ffaee876882b3f62c9b139279824de6a6e16448398fa513f7a.png',
    imageCredit: 'https://www.theodinproject.com',
    markdown: data3,
    tags: ['NodeJS', 'Express', 'PassportJS', 'MongoDB'],
  })
  await post3.save()
}
