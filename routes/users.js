const route = require("express").Router()
const isEmpty = require("is-empty")
const isEmail = require("is-email")
const User = require("../model/User")
const { genSaltSync, hashSync } = require("bcryptjs")
const passport = require("passport")
const { forwardAuth } = require("../config/auth")

// global failure redirect route
const failureRedirect = "/users/login"

// global success redirect route
const successRedirect = "/dashboard"

// form inputss
const { loginFields, registerFields } = require("../config/forms")

// start custom functions
/**
 *
 * @name hashPassword
 * @description hash the password
 * @param {string} pass
 * @returns hashed password
 */
function hashPassword(pass) {
  const salt = genSaltSync(10)
  const hashedPassword = hashSync(pass, salt)
  return hashedPassword
}
/**
 * @name reRenderPage
 * @description a custom function to re-render the page
 * @param {string} page
 * @param {object} res
 * @param {array} fields
 * @param {array} errors
 * @param {string} email
 * @param {string} name
 */
function reRenderPage(page, res, fields, errors, email, name = "") {
  if (page == "register") {
    fields.find((el) => el.name == "name").value = name
  }
  fields.find((el) => el.name == "email").value = email
  res.render(page, { fields, errors })
}
// end custom functions

// routes
/**
 * @name Login-Routes
 */
route.get("/login", forwardAuth, (req, res, next) => {
  res.render("login", { fields: loginFields })
})
route.post("/login", forwardAuth, (req, res, next) => {
  let errors = []
  let { email, password } = req.body

  // check & filter inputs
  if (isEmpty(email) || isEmpty(password)) {
    errors.push("please fill the require fields")
  } else if (!isEmail(email)) {
    errors.push("email field must contain a valid email")
  }

  // check & re-render the page
  if (isEmpty(errors)) {
    passport.authenticate("local", {
      successRedirect,
      failureRedirect,
      failureFlash: true,
    })(req, res, next)
  } else {
    reRenderPage("login", res, loginFields, errors, email)
  }
})
// Login-Routes

/**
 * @name Register-Routes
 */
route.get("/register", forwardAuth, (req, res, next) => {
  res.render("register", { fields: registerFields })
})
route.post("/register", forwardAuth, (req, res, next) => {
  let errors = []
  let { name, email, pass1, pass2 } = req.body
  const minNameLength = 4
  const minPassLength = 5

  // check & filter inputs
  if (isEmpty(name) || (isEmpty(email) && isEmpty(pass1))) {
    errors.push("please fill the require fields")
  } else {
    if (name.length < minNameLength) {
      errors.push(`name must be greater than ${minNameLength} characters`)
    }
    if (!isEmail(email)) {
      errors.push("email field must contain a valid email")
    }
    if (pass1.length < minPassLength) {
      errors.push(`password must be greater than ${minPassLength} characters`)
    } else if (pass1 !== pass2) {
      errors.push("password do not match")
    }
  }

  // check & re-render the page
  if (isEmpty(errors)) {
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push("email already exists")

        reRenderPage("register", res, registerFields, errors, email, name)
      } else {
        const password = hashPassword(pass1)

        let newUser = new User({ name, email, password })
        newUser
          .save()
          .then((user) => {
            req.flash(
              "successMSG",
              "you are registerd successfuly, now you can login",
            )
            res.redirect("/users/login")
          })
          .catch((err) => {
            const backURL = req.header("Referer") || "/"
            req.flash("errorMSG", "something went wrong")
            res.redirect(backURL)
            console.log(err)
          })
      }
    })
  } else {
    reRenderPage("register", res, registerFields, errors, email, name)
  }
})
// Register-Routes

/**
 * @name Logout-Route
 */
route.get("/logout", (req, res, next) => {
  req.logout()
  req.flash("successMSG", "You are logged out")
  res.redirect("/")
  next()
})
// Logout-Route

function globalRouteSetup(
  authRoute,
  provider,
  scopes = [],
  additionalArgs = {},
) {
  let authRouteOptions = {
    successRedirect,
    failureRedirect,
    failureFlash: true,
  }

  // if scopes are passed, add new option to the authroauthRouteOptions
  if (scopes.length > 0) {
    authRouteOptions.scope = scopes
  }

  route.get(
    `/auth/${authRoute}`,
    passport.authenticate(provider, { ...authRouteOptions, ...additionalArgs }),
  )
  route.get(
    `/auth/${authRoute}/callback`,
    passport.authenticate(provider, {
      failureRedirect,
      successRedirect,
    }),
  )
}

// github routes
globalRouteSetup("github", "github")

// gitlab routes
globalRouteSetup("gitlab", "gitlab", ["email"])

// google routes
globalRouteSetup("google", "google", ["profile"])

// facebook routes
globalRouteSetup("facebook", "facebook", ["profile"])

// instagram routes
globalRouteSetup("instagram", "instagram")

// discord routes
globalRouteSetup("discord", "discord", ["email", "identify"])

// dropbox routes
globalRouteSetup("dropbox", "dropbox-oauth2")

// export routes
module.exports = route
