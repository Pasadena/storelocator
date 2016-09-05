"use strict";

const express = require("express");
const path = require("path");
const http = require("http");
const Request = require("request");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('service-worker.js', express.static(path.join(__dirname, 'service-worker.js')));

const K_CHAIN_API = "http://www.k-market.fi/api/stores/searchStores";

router.get("/", (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

router.get("/k-proxy/:location", (req, res) => {
  const queryAddress = K_CHAIN_API + "?query=" + req.params.location.replace(":", "");
  req.pipe(Request(queryAddress, {end: true})).pipe(res, {end: true});
});

app.use('/', router);

app.listen(port, (err) => {
  if(err) {
    return console.log("Unexpected error encountered! ");
  }
  console.log("Server start with port " +port);
});
