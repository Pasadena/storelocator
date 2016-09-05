export const processingRequest = () => ({ type: "REQUEST_IN_PROGRESS" });

export const requestFailed = () => ({ type: "REQUEST_FAILED" });

export const dateSelected = (selectedDate) => ({ type: "DATE_SELECTED", selectedDate });

export const locationSelected = (location) => ({ type: "LOCATION_SELECTED", location });

export const storesLoaded = (stores, location) => ({ type: "STORES_LOADED", stores, location});
