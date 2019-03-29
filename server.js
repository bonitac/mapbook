"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");


// FUNCTION TO FETCH FROM KNEX
function knexSelectWhere(select, table, where, id, ejs, res) {
  let templateVars = {
    "id": id
  };
  knex
    .select(select)
    .from(table).where(where[0], where[1])
    .then((results) => {
      let resultsObj = JSON.parse(JSON.stringify(results));
      templateVars.data = resultsObj;
      res.render(ejs, templateVars);
    });
}

function knexSelect(select, table, id, ejs, res) {
  let templateVars = {
    "id": id
  };
  knex
    .select(select)
    .from(table)
    .then((results) => {
      let resultsObj = JSON.parse(JSON.stringify(results));
      templateVars.data = resultsObj;
      res.render(ejs, templateVars);
    });
}

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Maps page
app.get("/maps", (req, res) => {
  res.render("maps")
});

// Google map demo page
app.get("/gmaps", (req, res) => {
  res.render("googleMaps")
});
// Google map demo page w search function
app.get("/demo", (req, res) => {
  res.render("demo")
});




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
