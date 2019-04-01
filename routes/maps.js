"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.put("/", (req, res) => {
    knex.insert(req.body).into("maps")
    .then((result) => {

      knex.select("id").from("maps")//.orderBy("date_created","desc")
        .then((results) => {
        let resultsObj = JSON.parse(JSON.stringify(results));
        console.log("resultsObj = ", resultsObj);
        res.json(resultsObj);
      });

    });
  });

  return router;
}
