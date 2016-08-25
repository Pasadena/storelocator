import ReactPolymer from "react-polymer";
import React from "react";
import {PaperInput} from "react-polymer/input";

import {connect} from 'react-redux';
import {locationSelected} from '../actions/StoreActions.js';
import {getAdjacentStores} from '../services/StoreLocatorService.js'

class LocationInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    console.log(event);
    this.props.onLocationChanged(event.target.value);
  }

  render() {
    return (
      <PaperInput value={this.props.location} label="Location" placeHolder="Enter location..." onChange = { this.onChange }/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    location: state.location
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLocationChanged(location) {
      dispatch(locationSelected(location));
      dispatch(getAdjacentStores(location));
    }
  }
}

export const LocationSelector = connect(mapStateToProps, mapDispatchToProps)(LocationInput);
