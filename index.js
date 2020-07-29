const express = require("express");
const expEjsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 6600;

// init the app
const app = express();

// Use middlewars
app.use(expEjsLayouts);
app.set("view engine", "ejs");

// Set routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
