import NodeGeocoder from "node-geocoder";
import $ from 'jquery';

const geoOptions = {
  provider: 'google',
  language: "fi-FI",
  region: "FI"
}

export const geocoder = NodeGeocoder(geoOptions);

export const getCurrentCoordinates = () => {
  let deferred = $.Deferred();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
  } else {
    deferred.reject(new Error('Your broser does not support geolocation!'));
  }
  return deferred.promise();
}

export const locationToAddress = (geoLocation) => {
  let promise = geocoder.reverse({lat: geoLocation.coords.latitude, lon: geoLocation.coords.longitude})
  return promise;
}

export const addressToLocation = (address) => {
  let promise = geocoder.geocode(address);
  return promise;
}
