const route = require("express").Router();
const isEmpty = require("is-empty");
const isEmail = require("is-email");
const User = require("../module/User");
const { genSaltSync, hashSync } = require("bcryptjs");

// data
let loginFields = [
	{
		label: "email address",
		id: "email-input",
		type: "email",
		name: "email",
		placeholder: "Enter your email address",
		required: true,
		icon: "at",
	},
	{
		label: "password",
		id: "password-input",
		type: "password",
		name: "password",
		placeholder: "******",
		required: true,
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
		required: true,
		value: "",
		icon: "user",
	},
	{
		label: "email address",
		id: "email-input",
		type: "email",
		name: "email",
		placeholder: "Enter your email address",
		required: true,
		value: "",
		icon: "at",
	},
	{
		label: "password",
		id: "pass1-input",
		type: "password",
		name: "pass1",
		placeholder: "Enter a new password",
		required: true,
		value: "",
		icon: "lock",
	},
	{
		label: "re-password",
		id: "pass2-input",
		type: "password",
		name: "pass2",
		placeholder: "Confirm your password",
		required: true,
		value: "",
		icon: "lock",
	},
];

// routes
route.get("/dashboard", (req, res, next) => {
	res.render("dashboard");
});

/**
 * @name Login-Routes
 */
route.get("/login", (req, res, next) => {
	res.render("login", { fields: loginFields });
});
route.post("/login", (req, res, next) => {
	res.send(req.body);
});
// Login-Routes

/**
 * @name Register-Routes
 */
// a custom function to re-render register form
function reRenderPage(res, fields, errors, name, email) {
	fields.find((el) => el.name == "name").value = name;
	fields.find((el) => el.name == "email").value = email;
	res.render("register", { fields, errors });
}

route.get("/register", (req, res, next) => {
	res.render("register", { fields: registerFields });
});
route.post("/register", (req, res, next) => {
	let errors = [];
	let { name, email, pass1, pass2 } = req.body;
	const minNameLength = 4;
	const minPassLength = 5;

	// check & filter inputs
	if (isEmpty(name) || (isEmpty(email) && isEmpty(pass1))) {
		errors.push("please fill the require fields");
	} else {
		if (name.length < minNameLength) {
			errors.push(`name must be greater than ${minNameLength} characters`);
		}
		if (!isEmail(email)) {
			errors.push("email filed must contain a valid email");
		}
		if (pass1.length < minPassLength) {
			errors.push(`password must be greater than ${minPassLength} characters`);
		} else if (pass1 !== pass2) {
			errors.push("password do not match");
		}
	}

	// check & re-render the page
	if (isEmpty(errors)) {
		User.findOne({ email: email }).then((user) => {
			if (user) {
				errors.push("email already exists");

				reRenderPage(res, registerFields, errors, name, email);
			} else {
				const salt = genSaltSync(10);
				const password = hashSync(pass1, salt);

				let newUser = new User({ name, email, password });
				newUser.save().then((user) => {
					res.redirect("/login");
				});
			}
		});
	} else {
		reRenderPage(res, registerFields, errors, name, email);
	}
});
// Register-Routes

// export routes
module.exports = route;
