const encodeurl = require("encodeurl");

let mongoURI = "mongodb://localhost:27017/passport_app";

mongoURI = encodeurl(mongoURI);

module.exports = {
	mongoURI,
	port: process.env.PORT || 6600,
};
