import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import JwtStrategy from './strategies/jwt.js'
import dotenv from 'dotenv'
dotenv.config()

passport.use(JwtStrategy)

const secret = process.env.JWT_SECRET

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
    const accessToken = jwt.sign({ username }, secret, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ username }, secret, { expiresIn: '1d' })
    return res
      .status(200)
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
      .header('Authorization', `Bearer ${accessToken}`)
      .json({ message: 'Login Auth Passed' })
  } catch (err) {
    res.status(500)
    next(err)
  }
}

export const refresh = async (req, res) => {
  console.log(req.cookies)
  const refreshToken = req.cookies['refreshToken']
  if (!refreshToken) {
    return res.status(401).json({ message: 'Access Denied. No refresh token provided' })
  }
  try {
    const decoded = jwt.verify(refreshToken, secret)
    console.log({ decoded })
    const accessToken = jwt.sign({ username: decoded.username }, secret, { expiresIn: '10m' })

    res.header('Authorization', `Bearer ${accessToken}`).json({ message: 'Token refreshed' })
  } catch (err) {
    return res.status(400).json({ message: 'Invalid refresh token' })
  }
}

export const authenticate = async (req, res, next) => {
  console.log('Authenticating...')
  console.log(req.headers)
  const accessToken = req.headers['authorization'].split(' ')[1]
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
        req.username = decoded.username
        next()
      }
    })
    // Todo: Change to check role
  } catch (err) {
    return res.status(400).json({ message: 'Bad Request' })
  }
}

// export const authenticate = async (req, res, next) => {
//   console.log('Authenticating...')
//   console.log(req.headers)
//   // Get tokens from headers
//   const accessToken = req.headers['authorization'].split(' ')[1]
//   const refreshToken = req.cookies['refreshToken']
//   if (!accessToken && !refreshToken) {
//     return res.status(401).json({ message: 'No access token or refresh token provided' })
//   }
//   try {
//     const decoded = jwt.verify(accessToken, secret)
//     // Todo: Change to check role
//     if (decoded.username !== 'columk') {
//       return res.status(401).json({ message: 'Invalid access token' })
//     }
//     req.username = decoded.username
//     next()
//   } catch (err) {
//     if (!refreshToken) {
//       return res.status(401).json({ message: 'No refresh token provided' })
//     }
//     try {
//       const decoded = jwt.verify(refreshToken, secret)
//       // Todo: Change to check role
//       if (decoded.username !== 'columk') {
//         return res.status(401).json({ message: 'Invalid refresh token' })
//       }
//       const accessToken = jwt.sign({ username: decoded.username }, secret, { expiresIn: '10m' })
//       res
//         .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
//         .header('Authorization', `Bearer ${accessToken}`)
//         .json({ message: 'Auth Passed with refresh token' })
//     } catch (err) {
//       return res.status(400).json({ message: 'Invalid refresh token' })
//     }
//   }

// }
// passport.authenticate('jwt', { session: false })(req, res, next)

// (req, res) => res.status(200).json({ message: 'Middleware Auth Passed' })
