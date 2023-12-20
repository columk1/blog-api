import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import JwtStrategy from './strategies/jwt.js'
import dotenv from 'dotenv'
dotenv.config()

passport.use(JwtStrategy)

export const login = async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, password } = req.body
    console.log(username)
    const test = await mongoose.model('User').findOne()
    console.log(test)
    const user = await mongoose.model('User').findOne({ username })
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (!password) return res.status(401).json({ message: 'Password required' })
    // Check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
    const opts = {}
    opts.expiresIn = 120
    const secret = process.env.JWT_SECRET
    const token = jwt.sign({ username }, secret, opts)
    return res.status(200).json({ message: 'Login Auth Passed', token })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const authenticate = (req, res, next) => {
  console.log('Authenticating...')
  console.log(req.headers)
  passport.authenticate('jwt', { session: false })(req, res)
}
// (req, res) => res.status(200).json({ message: 'Middleware Auth Passed' })
