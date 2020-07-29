const route = require("express").Router();

route.get("/dashboard", (req, res, next) => {
	res.render("dashboard");
});

route.get("/login", (req, res, next) => {
	res.render("login");
});

route.get("/register", (req, res, next) => {
	res.render("register");
});

module.exports = route;
