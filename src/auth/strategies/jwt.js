import { Strategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
dotenv.config()

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

export default new Strategy(opts, (payload, done) => {
  console.log(payload)
  return payload.username === 'columk' ? done(null, true) : done(null, false)
})
