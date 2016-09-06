import NodeGeocoder from "node-geocoder";
import request from 'request';
import {processingRequest, storesLoaded, requestFailed} from '../actions/StoreActions'

import HttpsAdapter from "node-geocoder/lib/httpadapter/httpsadapter.js";

const K_CHAIN_API = "http://www.k-market.fi/api/stores/searchStores";

const httpAdapter = new HttpsAdapter(null, {
  headers: {
    "Accept-Language": "fi-FI",
    "Content-Language": "fi-FI"
  }
});

const geoOptions = {
  provider: 'google',
  language: "fi-FI",
  region: "FI",
  httpAdapter: httpAdapter
}

const geocoder = NodeGeocoder(geoOptions);

export const getAdjacentStores = (location) => {
  let queryAddress = K_CHAIN_API + "?query=" + location;
  return dispatch => {
    dispatch(processingRequest());
    request("http://localhost:3000/k-proxy/:" +location, (error, response, body) => {
      if(error) {
        console.log(error);
        dispatch(requestFailed());
      } else {
        dispatch(storesLoaded(JSON.parse(body)));
      }
    });
  }
}

const loadStoresForLocation = (geoLocation, dispatch) => {
  request("http://localhost:3000/k-proxy/:" +geoLocation.city, (error, response, body) => {
    if(error) {
      console.log(error);
      dispatch(requestFailed());
    } else {
      dispatch(storesLoaded(JSON.parse(body), geoLocation.formattedAddress));
    }
  });
}

export const getStoresWithGeolocation  = () => {
  return dispatch => {
    dispatch(processingRequest());
    getGeolocation(reverseGeolocation, dispatch);
  }
}

const getGeolocation = (callback, dispatch) => {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition((res) => {
      callback(res, dispatch);
    });
  }
  return null;
}

const reverseGeolocation = (geoLocation, dispatch) => {
  geocoder.reverse({lat: geoLocation.coords.latitude, lon: geoLocation.coords.longitude})
  .then(res => {
    loadStoresForLocation(res[0], dispatch);
  })
  .error(err => console.log(err));
}
