const route = require("express").Router();
const isEmpty = require("is-empty");
const isEmail = require("is-email");
const User = require("../model/User");
const { genSaltSync, hashSync } = require("bcryptjs");
const passport = require("passport");

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

// start custom functions
/**
 *
 * @name hashPassword
 * @description hash the password
 * @param {string} pass
 * @returns hashed password
 */
function hashPassword(pass) {
	const salt = genSaltSync(10);
	const hashedPassword = hashSync(pass, salt);
	return hashedPassword;
}
/**
 * @name reRenderPage
 * @description a custom function to re-render the page
 * @param {string} page
 * @param {object} res
 * @param {array} fields
 * @param {array} errors
 * @param {string} email
 * @param {string} name
 */
function reRenderPage(page, res, fields, errors, email, name = "") {
	if (page == "register") {
		fields.find((el) => el.name == "name").value = name;
	}
	fields.find((el) => el.name == "email").value = email;
	res.render(page, { fields, errors });
}
// end custom functions

// routes
/**
 * @name Login-Routes
 */(req, res, next) => {
	res.render("login", { fields: loginFields });
});
	let errors = [];
	let { email, password } = req.body;

	// check & filter inputs
	if (isEmpty(email) || isEmpty(password)) {
		errors.push("please fill the require fields");
	} else if (!isEmail(email)) {
		errors.push("email field must contain a valid email");
	}

	// check & re-render the page
	if (isEmpty(errors)) {
		passport.authenticate("local", {
			successRedirect: "/dashboard",
			failureRedirect: "/login",
			failureFlash: true,
		})(req, res, next);
	} else {
		reRenderPage("login", res, loginFields, errors, email);
	}
});
// Login-Routes

/**
 * @name Register-Routes
 */req, res, next) => {
	res.render("register", { fields: registerFields });
});
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
			errors.push("email field must contain a valid email");
		}
		if (pass1.length < minPassLength) {
			errors.push(`password must be greater than ${minPassLength} characters`);
		} else if (pass1 !== pass2) {
			errors.push("password do not match");
		}
	}

	// check & re-render the page
	if (isEmpty(errors)) {
		User.findOne({ email }).then((user) => {
			if (user) {
				errors.push("email already exists");

				reRenderPage("register", res, registerFields, errors, email, name);
			} else {
				const password = hashPassword(pass1);

				let newUser = new User({ name, email, password });
				newUser
					.save()
					.then((user) => {
						req.flash("successMSG", "you are registerd successfuly");
						res.redirect("/login");
					})
					.catch((err) => {
						const backURL = req.header("Referer") || "/";
						req.flash("errorMSG", "something went wrong");
						res.redirect(backURL);
						console.log(err);
					});
			}
		});
	} else {
		reRenderPage("register", res, registerFields, errors, email, name);
	}
});
// Register-Routes

// Logout-Route
route.get("/logout", (req, res) => {
	req.logout();
	req.flash("successMSG", "You are logged out");
	res.redirect("/");
});
// Logout-Route

// export routes
module.exports = route;
