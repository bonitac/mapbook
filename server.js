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
  // getting all the points for markers for the specific map
  
    res.render("maps")
});


app.get('/maps/1', (req, res) => {
//   //which only gets the points and return in the form of AJX
knex
  .select("*")
  .from("points")
  .where("map_id", 1)
  .then((results) => {
    res.json({results: results});
  })
})
app.get('/maps/deletePoint', (req, res) =>{
  let point_id = Number(req._parsedOriginalUrl.query)
  console.log(req._parsedOriginalUrl.query)

  knex('points')  
  .where("id",point_id)
  .del().then((result) => {
    console.log("del is done.");
    console.log("result = ", result);
    res.redirect("/maps");
  });
})


app.get("/demo", (req, res) => {
  res.render("demo")
});


app.post('/maps',(req,res)=>{
  console.log("we are in the post /maps route");
  console.log(req.body.title);
  console.log(req.body.date_created);
  knex('points').insert(req.body)
  .returning('id')
  //the promise, means the data entry was success
  .then((id) => {                                                                                                                                                                                                               
    res.json({
      result: true, id: id
    })
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
