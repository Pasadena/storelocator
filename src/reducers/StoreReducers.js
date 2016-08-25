const initialState = {
  isLoading: false,
  location: "",
  selectedDate: null,
  stores: []
}

export const storeReducer = (state = initialState, action) => {
  switch(action.type) {
    case "REQUEST_IN_PROGRESS":
      return Object.assign({}, state, {isLoading: true});
    case "REQUEST_FAILED":
      return Object.assign({}, state, {isLoading: false});
    case "LOCATION_SELECTED":
      return Object.assign({}, state, {location: action.location});
    case "DATE_SELECTED":
      return Object.assign({}, state, {selectedDate: action.selectedDate});
    case "STORES_LOADED":
      return Object.assign({}, state, {stores: action.stores});
    default:
      return state;
  }
}
