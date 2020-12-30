const { compareSync } = require("bcryptjs")
const { Strategy } = require("passport-local")
const User = require("../model/User")

// exports
module.exports = (passport) => {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            // check user existing
            if (!user) {
              return done(null, false, { msg: "user not found" })
            } else {
              // match password
              const isMatch = compareSync(password, user.password)
              if (isMatch) {
                return done(null, user)
              } else {
                return done(null, false, { msg: "password not matched" })
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
    ),
  )
}
