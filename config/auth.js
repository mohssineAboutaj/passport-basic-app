module.exports = {
	ensureAuth: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash("errorMSG", "please login to visit this page");
			res.redirect("/login");
		}
	},
	forwardAuth: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/dashboard");
		}
	},
};
