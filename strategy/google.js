const { Strategy } = require("passport-google-oauth20")
const User = require("../model/User")
const { google } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: google.client_id,
        clientSecret: google.client_secret,
        callbackURL: "/users/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = null
        const name = null
        User.findOne({ email }).then((user) => {
          if (user) {
            return done(null, user)
          } else {
            createNewUser(name, email, done)
          }
        })
      },
    ),
  )
}
