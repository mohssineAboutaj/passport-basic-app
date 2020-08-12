const route = require("express").Router();
const { ensureAuth, forwardAuth } = require("../config/auth");

route.get("/", (req, res) => {
	res.render("home");
});

route.get("/dashboard", ensureAuth, (req, res, next) => {
	res.render("dashboard");
});

module.exports = route;
