import NodeGeocoder from "node-geocoder";
import request from 'request';
import $ from 'jquery';
import {processingRequest, storesLoaded, requestFailed, locationSelected} from '../actions/StoreActions'

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
        let stores = JSON.parse(body);
        dispatchSortedStores(dispatch, stores);

      }
    });
  }
}

const dispatchSortedStores = (dispatch, storesToBeSorted) => {
  storesToBeSorted.sort( (first, second) => {
    let firstDistance = first.Distance.replace("km", "").trim();
    let secondDistance = second.Distance.replace("km", "").trim();
    return parseFloat(firstDistance) - parseFloat(secondDistance) < 0 ? -1 : 1;
  });
  dispatch(storesLoaded(storesToBeSorted));
}

export const getStoresWithGeolocation  = () => {
  return dispatch => {
    dispatch(processingRequest());
    getGeolocation(dispatch)
    .then(res => {
      reverseGeolocation(res, dispatch);
    }, err => {
      console.log(err);
      dispatch(requestFailed());
    });
  }
}

const getGeolocation = () => {
  let deferred = $.Deferred();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
  } else {
    deferred.reject(new Error('Your broser does not support geolocation!'));
  }
  return deferred.promise();
}

const reverseGeolocation = (geoLocation, dispatch) => {
  geocoder.reverse({lat: geoLocation.coords.latitude, lon: geoLocation.coords.longitude})
  .then(res => {
    dispatch(locationSelected(res[0].formattedAddress));
    dispatch(getAdjacentStores(res[0].city))
  })
  .error(err => {
    console.log(err);
    dispatch(requestFailed());
  });
}
