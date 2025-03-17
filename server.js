const express = require("express");
const bodyParser = require("body-parser");

const expressLayouts = require("express-ejs-layouts");
const static = require("./src/routes/static");
const cors = require("cors");
const path = require("path");
const receiptRoutes = require("./src/routes/receiptRoutes");
const baseController = require("./src/controllers/baseController");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(cors());

// Set up session middleware
app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up flash middleware
app.use(flash());

/* ***********************
 * view engine and templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Routes
app.use(static);

// Serve views folder
app.get("/", require("./src/routes/baseroute"));

app.get("/receipt", require("./src/routes/baseroute"));

app.use("/receipt", require("./src/routes/receiptRoutes"));
app.use("/receipts", require("./src/routes/receiptRoutes"));
app.use("/receiptDetails", require("./src/routes/receiptRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
