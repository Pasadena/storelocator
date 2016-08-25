import request from 'request';
import {processingRequest, storesLoaded, requestFailed} from '../actions/StoreActions'

const K_CHAIN_API = "http://www.k-market.fi/api/stores/searchStores";


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
