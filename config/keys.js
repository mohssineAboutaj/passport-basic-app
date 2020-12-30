// import dependencies & confi
const encodeurl = require("encodeurl")
const { mongoURI: newMongoURI } = require("../config.json")

// default values
const defaultMongoURI = "mongodb://localhost:27017/passport_app"
const defaultPass = "social-auth"

// set mongodb URI
const mongoURI = newMongoURI || defaultMongoURI

// exports
module.exports = {
  mongoURI: encodeurl(mongoURI),
  port: process.env.PORT || 6600,
  defaultPass,
}
