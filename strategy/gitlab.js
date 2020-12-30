const { Strategy } = require("passport-gitlab2")
const User = require("../model/User")
const { gitlab } = require("../config.json")

module.exports = (passport, createNewUser) => {
  passport.use(
    new Strategy(
      {
        clientID: gitlab.client_id,
        clientSecret: gitlab.client_secret,
        callbackURL: "/users/auth/gitlab/callback",
        profileFields: ["id", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        // const email = profile._json.email;
        // const name = profile.displayName || profile.username;
        // User.findOne({ email }).then((user) => {
        // 	if (user) {
        // 		return done(null, user);
        // 	} else {
        // 		createNewUser(name, email, done);
        // 	}
        // });
      },
    ),
  )
}
