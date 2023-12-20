import mongoose from 'mongoose'

const roles = ['user', 'admin']

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      lowercase: true,
      minLength: 6,
      maxLength: 24,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 6,
      maxLength: 96,
    },
    role: { type: String, enum: roles, default: 'user' },
    avatar: { type: String },
  },
  { timestamps: true }
)

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  })

  if (!user) {
    user = await this.findOne({ email: login })
  }

  return user
}

// A pre hook to our user schema to remove all messages of this user on its deletion. You don't need to call next when using await.
userSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await this.model('Post').deleteMany({ author: this._id })
})

const User = mongoose.model('User', userSchema)

export default User
