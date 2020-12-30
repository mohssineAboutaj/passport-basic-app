const { Strategy } = require("passport-instagram")
const User = require("../model/User")
const { instagram } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: instagram.client_id,
        clientSecret: instagram.client_secret,
        callbackURL: "/users/auth/instagram/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email
        const name = profile.username || profile.displayName
        User.findOne({ email }).then((user) => {
          if (user) {
            return done(null, user)
          } else {
            console.log(profile)
            // createNewUser(name, email, done);
          }
        })
      },
    ),
  )
}
