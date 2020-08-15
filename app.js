const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const { connect } = require("mongoose");
const { mongoURI, port } = require("./config/keys");
const { urlencoded } = express;
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport");

// init the app
const app = express();

// passport config
passportConfig(passport);

// Connect to Mongodb
connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log("Mongodb connected");
	})
	.catch((err) => {
		console.log(err);
	});

// Setup Ejs
app.use(expressEjsLayouts);
app.set("view engine", "ejs");

// Setup bodyParser
app.use(urlencoded({ extended: false }));

// Setup flash
app.use(flash());

// Setup session
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: "secret",
	})
);

// Set Global variables
app.use((req, res, next) => {
	res.locals.successMSG = req.flash("successMSG");
	res.locals.errorMSG = req.flash("errorMSG");
	res.locals.user = req.user || undefined;
	res.locals.navLinks = [
		{
			label: "home",
			href: "/",
			icon: "home",
			needAuth: false,
		},
		{
			label: "dashboard",
			href: "/dashboard",
			icon: "chart-area",
			needAuth: true,
		},
		{
			label: "login",
			href: "/users/login",
			icon: "sign-in-alt",
			needAuth: false,
		},
		{
			label: "register",
			href: "/users/register",
			icon: "user-plus",
			needAuth: false,
		},
		{
			label: "logout",
			href: "/users/logout",
			icon: "power-off",
			needAuth: true,
		},
	];
	next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set routes
app.use("/", require("./routes/index"));

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
