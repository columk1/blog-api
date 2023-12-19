import mongoose from 'mongoose'

import User from './user.js'
// import Post from './post.js'
// import Comment from './comment'

const eraseDatabaseOnSync = true

export const connectDb = async () => {
  mongoose.connect(process.env.DATABASE_URL).then(async () => {
    if (eraseDatabaseOnSync) {
      await User.deleteMany({})
      populateDb()
    }
  })
}

const populateDb = async () => {
  const user = new User({
    username: 'columk',
    password: 'password',
    role: 'admin',
  })
  await user.save()
}
