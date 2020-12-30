const { Strategy } = require("passport-facebook")
const User = require("../model/User")
const { facebook } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: facebook.client_id,
        clientSecret: facebook.client_secret,
        callbackURL: "/users/auth/facebook/callback",
        profileFields: ["id", "email", "name"],
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email
        const name =
          profile.username ||
          profile.displayName ||
          profile._json.first_name + "" + profile.last_name
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
