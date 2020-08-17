// user model
const User = require("../model/User");

// dependencies
const { compareSync } = require("bcryptjs");

// stratygies
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google").Strategy;

// keys & id
const { config } = require("./keys");

// exports
module.exports = (passport) => {
	/**
	 * @method LocalStrategy
	 */

	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
			},
			(email, password, done) => {
				User.findOne({ email })
					.then((user) => {
						// check user existing
						if (!user) {
							return done(null, false, { msg: "user not found" });
						} else {
							// match password
							const isMatch = compareSync(password, user.password);
							if (isMatch) {
								return done(null, user);
							} else {
								return done(null, false, { msg: "password not matched" });
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},
		),
	);

	/**
	 * @method GithubStrategy
	 */
	passport.use(
		new GithubStrategy(
			{
				clientID: config.github.client_id,
				clientSecret: config.github.client_secret,
				callbackURL: "/users/auth/github/callback",
			},
			(accessToken, refreshToken, profile, cb) => {
				console.log(profile);
				// User.findOrCreate({ githubId: profile.id }, (err, user) => {
				// 	return cb(err, user);
				// });
			},
		),
	);

	// serialize the user
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// deserialize the user
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
