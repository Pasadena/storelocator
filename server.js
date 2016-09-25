"use strict";

const express = require("express");
const path = require("path");
const http = require("http");
const Request = require("request");
const bodyParser = require('body-parser');
const distance = require('google-distance');
const Promise = require('promise');
const GoogleLocations = require('google-locations');

const locations = new GoogleLocations('AIzaSyACuf5152Ocl7UJtZATACufBo-NQW78djE');

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

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
  locations.search({
    location: [location.split(",").map(locPart => parseFloat(locPart))],
    radius: 5000,
    types: [ "grocery_or_supermarket" ]
  }, (err, response) => {
    let stores = [];
    for(var storeIndex in response.results) {
      let storePart = response.results[storeIndex];
      stores.push(storePart);
    }
    stores.map( (store, index) => store.Distance = "5 km");
    res.send(stores);
    /**calculateDistanceMatrix(stores, getStoreLocationsAsCoordinates(stores))
    .then(result => {
      stores.map( (store, index) => store.Distance = result[index].distance);
      res.send(stores);
    }, error => console.log(error));**/
  });
});

const getStoreLocationsAsCoordinates = (stores) => {
  return stores.map((store) => store.geometry.location.lat + "," + store.geometry.location.lng)
}

const calculateDistanceMatrix = (origin, destinations) => {
  return calculateDistance({
    origins: origin,
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
