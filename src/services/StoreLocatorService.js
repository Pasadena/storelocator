import NodeGeocoder from "node-geocoder";
import request from 'request';
import {processingRequest, storesLoaded, requestFailed} from '../actions/StoreActions'

const K_CHAIN_API = "http://www.k-market.fi/api/stores/searchStores";

const geocoder = NodeGeocoder();

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

const loadStoresForLocation = (location, dispatch) => {
  request("http://localhost:3000/k-proxy/:" +location, (error, response, body) => {
    if(error) {
      console.log(error);
      dispatch(requestFailed());
    } else {
      dispatch(storesLoaded(JSON.parse(body), location));
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
    const cityName = res.raw.results[1].address_components[0].long_name;
    loadStoresForLocation(cityName, dispatch);
  })
  .error(err => console.log(err));
}
