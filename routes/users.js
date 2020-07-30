const route = require("express").Router();

// data
let loginFields = [
	{
		label: "email address",
		id: "email-input",
		type: "email",
		name: "email",
		placeholder: "Enter your email address",
		smallText: "Help name text",
		icon: "at",
	},
	{
		label: "password",
		id: "password-input",
		type: "password",
		name: "password",
		placeholder: "******",
		smallText: "Help password text",
		icon: "lock",
	},
];

let registerFields = [
	{
		label: "name",
		id: "name-input",
		type: "text",
		name: "name",
		placeholder: "Enter your name",
		smallText: "Help name text",
		icon: "user",
	},
	{
		label: "email address",
		id: "email-input",
		type: "email",
		name: "email",
		placeholder: "Enter your email address",
		smallText: "Help name text",
		icon: "at",
	},
	{
		label: "password",
		id: "pass1-input",
		type: "password",
		name: "pass1",
		placeholder: "Enter a new password",
		smallText: "Help pass1 text",
		icon: "lock",
	},
	{
		label: "re-password",
		id: "pass2-input",
		type: "password",
		name: "pass2",
		placeholder: "Confirm your password",
		smallText: "Help pass2 text",
		icon: "lock",
	},
];

// routes
route.get("/dashboard", (req, res, next) => {
	res.render("dashboard");
});

route.get("/login", (req, res, next) => {
	res.render("login", { fields: loginFields });
});

route.get("/register", (req, res, next) => {
	res.render("register", { fields: registerFields });
});

module.exports = route;
