import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import JwtStrategy from './strategies/jwt.js'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

passport.use(JwtStrategy)

const secret = process.env.JWT_SECRET
const cookieOptions = { httpOnly: true, secure: true, sameSite: 'none' }

export const login = async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, password } = req.body
    console.log(username)
    const user = await mongoose.model('User').findOne({ username })
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (!password) return res.status(401).json({ message: 'Password required' })
    // Check password
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })
    // Generate tokens
    const jti = uuidv4()
    const accessToken = jwt.sign({ username }, secret, { expiresIn: '1m' })
    const refreshToken = jwt.sign({ username }, secret, { expiresIn: '1d', jwtid: jti })
    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', refreshToken, { ...cookieOptions, path: '/api/auth/refresh' })
      .json({ message: 'Login Auth Passed', user: username })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    res
      .status(204)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({ message: 'Logged out' })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const refresh = async (req, res) => {
  console.log(req.host)
  console.log(req.cookies)
  const refreshToken = req.cookies['refreshToken']
  if (!refreshToken) {
    return res.status(401).json({ message: 'Access Denied. No refresh token provided' })
  }
  try {
    console.log('Refreshing...')
    jwt.verify(refreshToken, secret, function (err, decoded) {
      console.log({ decoded })
      const jti = uuidv4()
      const accessToken = jwt.sign({ username: decoded.username }, secret, { expiresIn: '1m' })
      const refreshToken = jwt.sign({ username: decoded.username }, secret, {
        expiresIn: '1d',
        jwtid: jti,
      })
      res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, { ...cookieOptions, path: '/api/auth/refresh' })
        .json({ message: 'Token refreshed', user: decoded.username })
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

export const authenticate = async (req, res, next) => {
  console.log('Authenticating...')
  console.log(req.headers)
  const accessToken = req.cookies?.['accessToken']
  if (!accessToken) {
    return res.status(400).json({ message: 'No access token provided' })
  }
  try {
    jwt.verify(accessToken, secret, function (err, decoded) {
      if (err) {
        // Access token expired - TODO: Test this in client
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Access token expired' })
        }
        return res.status(403).json({ message: 'Invalid access token' })
      } else {
        if (decoded.username !== 'columk') {
          return res.status(403).json({ message: 'Not authorized' })
        }
        req.user = decoded.username
        next()
      }
    })
    // Todo: Change to check role
  } catch (err) {
    return res.status(400).json({ message: 'Bad Request' })
  }
}

// passport.authenticate('jwt', { session: false })(req, res, next)

// (req, res) => res.status(200).json({ message: 'Middleware Auth Passed' })
