const { Strategy } = require("passport-github")
const User = require("../model/User")
const { github } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: github.client_id,
        clientSecret: github.client_secret,
        callbackURL: "/users/auth/github/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email
        const name = profile.displayName || profile.username
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
