// user model
const User = require("../model/User");

// dependencies
const { compareSync } = require("bcryptjs");

// stratygies
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: GithubStrategy } = require("passport-github");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: InstagramStrategy } = require("passport-instagram");

// keys & id
const { config, defaultPass } = require("./keys");

/**
 *
 * @name createNewUser
 * @type function
 * @description create new user that use social media auth
 * @param {name} string
 * @param {email} string
 * @param {done} function
 * @returns done
 */
function createNewUser(name, email, done) {
	let newUser = new User({ name, email, password: defaultPass });
	newUser
		.save()
		.then(() => {
			console.log("user added successfuly");
		})
		.catch((errr) => {
			console.log(errr);
		});
	return done(null, newUser);
}

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
			(accessToken, refreshToken, profile, done) => {
				const email = profile._json.email;
				const name = profile.displayName || profile.username;
				User.findOne({ email }).then((user) => {
					if (user) {
						return done(null, user);
					} else {
						createNewUser(name, email, done);
					}
				});
			},
		),
	);

	/**
	 * @method GoogleStrategy
	 */
	// passport.use(
	// 	new GoogleStrategy(
	// 		{
	// 			clientID: config.google.client_id,
	// 			clientSecret: config.google.client_secret,
	// 			callbackURL: "/users/auth/google/callback",
	// 		},
	// 		(accessToken, refreshToken, profile, done) => {
	// 			const email = null;
	// 			const name = null;
	// 			User.findOne({ email }).then((user) => {
	// 				if (user) {
	// 					return done(null, user);
	// 				} else {
	// 					createNewUser(name, email, done);
	// 				}
	// 			});
	// 		},
	// 	),
	// );

	/**
	 * @method FacebookStrategy
	 */
	passport.use(
		new FacebookStrategy(
			{
				clientID: config.facebook.client_id,
				clientSecret: config.facebook.client_secret,
				callbackURL: "/users/auth/facebook/callback",
			},
			(accessToken, refreshToken, profile, done) => {
				const email = profile._json.email;
				const name = profile.username || profile.displayName;
				User.findOne({ email }).then((user) => {
					if (user) {
						return done(null, user);
					} else {
						console.log(profile);
						// createNewUser(name, email, done);
					}
				});
			},
		),
	);

	/**
	 * @method InstagramStrategy
	 */
	passport.use(
		new InstagramStrategy(
			{
				clientID: config.facebook.client_id,
				clientSecret: config.facebook.client_secret,
				callbackURL: "/users/auth/facebook/callback",
			},
			(accessToken, refreshToken, profile, done) => {
				const email = profile._json.email;
				const name = profile.username || profile.displayName;
				User.findOne({ email }).then((user) => {
					if (user) {
						return done(null, user);
					} else {
						console.log(profile);
						// createNewUser(name, email, done);
					}
				});
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
