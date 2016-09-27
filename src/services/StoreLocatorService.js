import $ from 'jquery';
import {processingRequest, storesLoaded, requestFailed, locationSelected} from '../actions/StoreActions'
import {addressToLocation, getCurrentCoordinates, locationToAddress, geocoder} from './GeoService.js';

const K_CHAIN_API = "http://www.k-market.fi/api/stores/searchStores";

export const getNearbyStores = (address) => {
  return dispatch => {
    dispatch(processingRequest());
    geocoder.geocode(address, ( err, data ) => {
      if(err) {
        dispatch(requestFailed());
      } else {
        fetchStores(data, dispatch)
      }
    });
  }
}

export const getStoresWithGeolocation  = () => {
  return dispatch => {
    dispatch(processingRequest());
    getCurrentCoordinates()
    .then(res => {
      locationToAddress(res).then(location => dispatch(locationSelected(location[0].formattedAddress)));
      dispatch(fetchStores([res.coords.latitude, res.coords.longitude ]));
    }, err => {
      console.log(err);
      dispatch(requestFailed());
    });
  }
}

const fetchStores = (location, dispatch) => {
  return dispatch => {
    let queryAddress = K_CHAIN_API + "?query=" + location;
    $.get(window.location.href + "k-proxy/:" +location)
    .done(data => {
      console.log(data);
      dispatchSortedStores(dispatch, data);
    })
    .fail(err => {
      console.log(error);
      dispatch(requestFailed());
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
