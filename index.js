// import express
const express = require("express");
// import routes
const routes = require("./routes");
// import path
const path = require("path");
//import bodyParser
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// import variables
require("dotenv").config({ path: "variables.env" });

// helpers with any functions
const helpers = require("./helpers");

// Create db connection
const db = require("./config/db");

// import models
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("Conectado"))
  .catch((error) => console.log(error));

// create a express app
const app = express();

// load statics files
app.use(express.static("public"));

// enable pug
app.set("view engine", "pug");

// enable bodyParser for read form data.
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add validator
// app.use(expressValidator());

// add view folder
app.set("views", path.join(__dirname, "./views"));

// Add flash messages
app.use(flash());

app.use(cookieParser());

// Session that allow us to navegate in between different pages without re-authenticating
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// var dump in the aplication
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  console.log(res.locals.usuario);
  next();
});

app.use("/", routes());

// u can use any port
// Server and PORT
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log("El Servidor esta funcionando!");
});
