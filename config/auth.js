module.exports = {
	/**
	 * @name ensureAuth
	 * @type function
	 * @description ensure user if it already isAuthenticated
	 */
	ensureAuth: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash("errorMSG", "please login to visit that page");
			res.redirect("/users/login");
		}
	},
	/**
	 * @name forwardAuth
	 * @type function
	 * @description redirect user if it already isAuthenticated
	 */
	forwardAuth: (req, res, next) => {
		if (!req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/dashboard");
		}
	},
	/**
	 * @name noAuth
	 * @type function
	 * @description non-auth pages
	 */
	noAuth: (req, res, next) => {
		return next();
	},
};
