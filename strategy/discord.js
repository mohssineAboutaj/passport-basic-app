const { Strategy } = require("passport-discord")
const User = require("../model/User")
const { discord } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: discord.client_id,
        clientSecret: discord.client_secret,
        callbackURL: "/users/auth/discord/callback",
        scope: ["email", "identify"],
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.email
        const name = profile.username
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
