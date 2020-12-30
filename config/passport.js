// user model
const User = require("../model/User")

// stratygies
const LocalStrategy = require("../strategy/local")
const GithubStrategy = require("../strategy/github")
const GitlabStrategy = require("../strategy/gitlab")
const FacebookStrategy = require("../strategy/facebook")
const GoogleStrategy = require("../strategy/google")
const InstagramStrategy = require("../strategy/instagram")
const DiscordStrategy = require("../strategy/discord")
const DropboxStrategy = require("../strategy/dropbox")

// keys & id
const { defaultPass } = require("./keys")

/**
 *
 * @name createNewUser
 *
 * @type function
 *
 * @description create new user that use social media auth
 *
 * @param {name} string
 * @param {email} string
 * @param {done} function
 *
 * @returns newUser
 */
function createNewUser(name, email, done) {
  let newUser = new User({ name, email, password: defaultPass })
  newUser
    .save()
    .then(() => {
      console.log("user added successfuly")
    })
    .catch((errr) => {
      console.log(errr)
    })
  return done(null, newUser)
}

// exports
module.exports = (passport) => {
  // Local strategy
  LocalStrategy(passport)

  // vithub stategy
  GithubStrategy(passport, createNewUser)

  // // Gitlab stategy
  // GitlabStrategy(passport, createNewUser)

  // Facebook strategy
  FacebookStrategy(passport, createNewUser)

  // // Google strategy
  // GoogleStrategy(passport, createNewUser)

  // // Instagram strategy
  // InstagramStrategy(passport, createNewUser)

  // // Discord strategy
  // DiscordStrategy(passport, createNewUser)

  // // Dropbox strategy
  // DropboxStrategy(passport, createNewUser)

  // serialize the user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
