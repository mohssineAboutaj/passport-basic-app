const { Strategy } = require("passport-dropbox-oauth2")
const User = require("../model/User")
const { dropbox } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        apiVersion: "2",
        clientID: dropbox.client_id,
        clientSecret: dropbox.client_secret,
        callbackURL: "/users/auth/dropbox/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email
        const name = profile.displayName || profile._json.name.display_name
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
