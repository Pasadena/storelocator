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
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

let router = express.Router();

const calculateDistance = Promise.denodeify(distance.get);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/bower_components/',
  express.static(__dirname + '/bower_components/'));
app.use('/bower_components/vaadin-date-picker/vaadin-date-picker.html',
    express.static(__dirname + '/bower_components/vaadin-date-picker/vaadin-date-picker.html'));
app.use('/bower_components/vaadin-grid/vaadin-grid.html',
    express.static(__dirname + '/bower_components/vaadin-grid/vaadin-grid.html'));

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
    calculateDistanceMatrix([location], getStoreLocationsAsCoordinates(response.results))
    .then(result => {
      stores.map( (store, index) => {
        store.distance = result[index].distance;
        store.openNow = isStoreOpen(store);
      });
      res.send(stores);
    }, error => {
      console.log(error);
      res.status(500).send({ error: error});
    });
  });
});

const isStoreOpen = (store) => {
  if(!store.opening_hours) {
    return "???";
  }
  return store.opening_hours.open_now ? "Yes" : "No";
}

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
  console.log("We are running application in " + env + " mode");
});
