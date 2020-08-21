const route = require("express").Router();
const { ensureAuth } = require("../config/auth");
const passport = require("passport");

// home page
route.get("/", (req, res) => {
	res.render("home", { user: req.user || undefined });
});

// dashboard page
route.get("/dashboard", ensureAuth, (req, res, next) => {
	res.render("dashboard", {
		user: req.user,
	});
});

// users page
route.use("/users", require("./users"));

// exports
module.exports = route;
