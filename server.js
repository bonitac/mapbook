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
const mapsRoutes = require("./routes/maps");

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
app.use("/maps/add", mapsRoutes(knex));

/******** Public Varaibles ********/
let p_currentUserID = 0;
let p_mapListType = 1;  // 1-All Maps, 2-Favourite Maps, 3-Contributed Maps

// Maps page
app.get("/maps", (req, res) => {
  p_mapListType = 1;
  if (knex.select("*").from("maps").length == 0){}
  else {
    knex.select("*").from("maps").then((results) => {
      let mapsObj = JSON.parse(JSON.stringify(results));
      let lastestMap = mapsObj[mapsObj.length - 1].id;
      res.redirect("/maps/" + lastestMap.toString());
    });
  }
});

function getSpecificMapInfo(mapID, req, res) {
  let resultObj = {};
  knex.select("*").from("points").where("map_id", mapID)
  .then((results) => {
    resultObj.results = JSON.parse(JSON.stringify(results));
    knex.select("icon").from("maps").where("id", mapID)
    .then((results) => {
      let markIcon = JSON.parse(JSON.stringify(results));
      resultObj.mark_icon = markIcon[0].icon;
      res.json(resultObj);
    });
  });
}

app.get('/gm/maps/:mapID', (req, res) => {
  let mapID = req.params.mapID;
  getSpecificMapInfo(mapID, req, res);
});

app.get('/gm/favourite/:mapID', (req, res) => {
  if (!req.params.mapID){
    console.log("No favourites")
  }
  else{
    let mapID = req.params.mapID;
    getSpecificMapInfo(mapID, req, res);
  }
  
});

app.get('/gm/contribute/:mapID', (req, res) => {
  let mapID = req.params.mapID;
  getSpecificMapInfo(mapID, req, res);
});

app.post('/like', (req, res) => {

  knex('user_favourite').insert(req.body)
  .then((result) => {

    res.json({ result: true});
  });
});

app.get('/unlike', (req, res) => {
  // console.log(">>> ", req.query);
  knex('user_favourite').where("user_id",req.query.user_id).andWhere("map_id",req.query.map_id)
    .del().then((result) => {
    // console.log(">>> Delete complete!");
    res.json({ result: true});
    // res.redirect("/maps/" + req.params.mapID);
  });
});

app.post('/maps',(req,res)=>{
  //the promise, means the data entry was success
  knex('points').insert(req.body).returning('id')
  .then((id) => {
    res.json({ result: true, id: id });
  });
});

// Selected A Map Page from All Map List
app.get("/maps/:mapID", (req, res) => {
  p_mapListType = 1;
  let templateVars = {
    curMapID: req.params.mapID,
    mapListType: p_mapListType
  };
  // 1. Find All Maps Info.
  knex.select("*").from("maps").then((results) => {
    let mapsObj = JSON.parse(JSON.stringify(results));
    templateVars.maps = mapsObj;

    // 2. Find All Points Info. for current Map
    knex.select("*").from("points").where("map_id", templateVars.curMapID).then((results) => {
      let pointsObj = JSON.parse(JSON.stringify(results));
      templateVars.points = pointsObj;

      // 3. Find User-Favourite Info.
      knex.select("*").from("user_favourite").then((results) => {
        let ufObj = JSON.parse(JSON.stringify(results));
        templateVars.user_favourite = ufObj;

        // 4. Find All Users Info.
        knex.select("*").from("users").then((results) => {
          let usersObj = JSON.parse(JSON.stringify(results));
          templateVars.users = usersObj;

          if(p_currentUserID <= 0) {
            templateVars.curUser = false;
            res.render("maps", templateVars);
          } else {
            knex.select("*").from("users").where('id', p_currentUserID).then((results) => {
              let userObj = JSON.parse(JSON.stringify(results));
              templateVars.curUser = userObj[0];

              res.render("maps", templateVars);
            });
          }

        });

      });

    });

  });

});

// Contributed Maps
app.get("/contribute", (req, res) => {
  p_mapListType = 3;
  knex.select("*").from("maps").where("user_id", p_currentUserID)
    .then((results) => {
      let mapsObj = JSON.parse(JSON.stringify(results));
      let lastestMap = mapsObj[mapsObj.length - 1].id;
      res.redirect("/contribute/" + lastestMap.toString());
    });
});

// Selected A Map Page from Contributed Map List
app.get("/contribute/:mapID", (req, res) => {
  p_mapListType = 3;
  let templateVars = {
    curMapID: req.params.mapID,
    mapListType: p_mapListType
  };
  // 1. Find Current User Info.
  knex.select("*").from("users").where('id', p_currentUserID).then((results) => {

    let userObj = JSON.parse(JSON.stringify(results));
    templateVars.curUser = userObj[0];

    // 2. Find All Maps Info.
    knex.select("*").from("maps").where("user_id", p_currentUserID).then((results) => {
      let mapsObj = JSON.parse(JSON.stringify(results));
      templateVars.maps = mapsObj;

      // 3. Find All Points Info. for current Map
      knex.select("*").from("points").where("map_id", templateVars.curMapID).then((results) => {
        let pointsObj = JSON.parse(JSON.stringify(results));
        templateVars.points = pointsObj;

        //4. Find All Users Info. for current Map
        knex.select("*").from("users").then((results) => {
          let usersObj = JSON.parse(JSON.stringify(results));
          templateVars.users = usersObj;

          // 5. Find User-Favourite Info.
          knex.select("*").from("user_favourite").then((results) => {
            let ufObj = JSON.parse(JSON.stringify(results));
            templateVars.user_favourite = ufObj;
            res.render("maps", templateVars);
          });

        });

      });

    });

  });

});

// Favourite Maps
app.get("/favourite", (req, res) => {
  p_mapListType = 2;
  if (!knex.select("*").from("user_favourite").where("user_id", p_currentUserID).length){
    res.send("No favourites") // want a better thing instead of just the plain text
  }
  else {
  knex.select("*").from("user_favourite").where("user_id", p_currentUserID)
    .then((results) => {
      let ufObj = JSON.parse(JSON.stringify(results));
      let lastestMap = ufObj[ufObj.length - 1].map_id;
      res.redirect("/favourite/" + lastestMap.toString());
    });
  }
});

// Selected A Map Page from Favourite Map List
app.get("/favourite/:mapID", (req, res) => {
  p_mapListType = 2;
  let templateVars = {
    curMapID: req.params.mapID,
    mapListType: p_mapListType
  };
  // 1. Find Current User Info.
  knex.select("*").from("users").where('id', p_currentUserID).then((results) => {

    let userObj = JSON.parse(JSON.stringify(results));
    templateVars.curUser = userObj[0];

    // 2. Find All Maps Info.
    knex.select("*").from("maps AS m").join("user_favourite AS uf", "m.id", "uf.map_id")
    .where("uf.user_id", p_currentUserID).then((results) => {
      let mapsObj = JSON.parse(JSON.stringify(results));
      templateVars.maps = mapsObj;

      // 3. Find All Points Info. for current Map
      knex.select("*").from("points").where("map_id", templateVars.curMapID).then((results) => {
        let pointsObj = JSON.parse(JSON.stringify(results));
        templateVars.points = pointsObj;

        //4. Find All Users Info. for current Map
        knex.select("*").from("users").then((results) => {
          let usersObj = JSON.parse(JSON.stringify(results));
          templateVars.users = usersObj;

          // 5. Find User-Favourite Info.
          knex.select("*").from("user_favourite").then((results) => {
            let ufObj = JSON.parse(JSON.stringify(results));
            templateVars.user_favourite = ufObj;
            res.render("maps", templateVars);
          });

        });

      });

    });

  });

});





app.get('/deletePoint/:mapID', (req, res) =>{
  let point_id = Number(req._parsedOriginalUrl.query);
  knex('points').where("id",point_id).del().then((result) => {
    res.redirect("/maps/" + req.params.mapID);
  });
})

app.post('/maps/editPoint', (req, res) =>{
  let point = req.body;
  knex('points').where("id",point.id).update(point)
  .then((result) => {
    res.redirect('/maps');
  });
})

app.get("/login/:userID", (req, res) => {
  p_currentUserID = req.params.userID;
  p_mapListType = 1;
  knex.select("*").from("maps").then((results) => {
    let mapsObj = JSON.parse(JSON.stringify(results));
    let lastestMap = mapsObj[mapsObj.length - 1].id;
    res.redirect("/maps/" + lastestMap.toString());
  });
});

app.get("/logout", (req, res) => {
  //req.session.user_id = "";
  p_currentUserID = -1;
  p_mapListType = 1;
  knex.select("*").from("maps").then((results) => {
    let mapsObj = JSON.parse(JSON.stringify(results));
    let lastestMap = mapsObj[mapsObj.length - 1].id;
    res.redirect("/maps/" + lastestMap.toString());
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
