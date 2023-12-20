import { Strategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
dotenv.config()

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.JWT_SECRET

export default new Strategy(options, (payload, done) => {
  console.log(payload)
  return payload.username === 'columk' ? done(null, true) : done(null, false)
})
