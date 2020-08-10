const express = require("express");
const expEjsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 6600;
const { connect } = require("mongoose");
const { mongoURI } = require("./config/keys");
const { urlencoded } = express;
const flash = require("connect-flash");
const session = require("express-session");

// init the app
const app = express();

// Setup Mongodb
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
app.use(expEjsLayouts);
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
	next();
});

// Set routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
