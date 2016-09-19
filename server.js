"use strict";

const express = require("express");
const path = require("path");
const http = require("http");
const Request = require("request");
const bodyParser = require('body-parser');
const distance = require('google-distance');
const Promise = require('promise');

const app = express();
const port = 3000;

let router = express.Router();

const calculateDistance = Promise.denodeify(distance.get);

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
  const location = req.params.location.replace(":", "");
  const queryAddress = K_CHAIN_API + "?query=" + location;

  Request(queryAddress, (error, response, body) => {
    let stores = JSON.parse(body);
    calculateDistanceMatrix(location , getStoreLocationsAsCoordinates(stores))
    .then(result => {
      console.log(result);
      stores.map( (store, index) => store.Distance = result[index].distance);
      res.send(stores);
    });
  });
});

const getStoreLocationsAsCoordinates = (stores) => {
  return stores.map((store) => store.Latitude + "," + store.Longitude)
}

const calculateDistanceMatrix = (origin, destinations) => {
  return calculateDistance({
    origins: [ origin ],
    destinations: destinations,
    mode: 'walking',
    key: 'AIzaSyACuf5152Ocl7UJtZATACufBo-NQW78djE'
  });
}


app.use('/', router);

app.listen(port, (err) => {
  if(err) {
    return console.log("Unexpected error encountered! ");
  }
  console.log("Server start with port " +port);
});
