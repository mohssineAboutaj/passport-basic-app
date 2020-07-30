const express = require("express");
const expEjsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 6600;
const { connect } = require("mongoose");
const { mongoURI } = require("./config/keys");
const { urlencoded } = express;

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

// Set routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
