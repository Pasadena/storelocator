import ReactPolymer from "react-polymer";
import React from "react";
import {PaperInput} from "react-polymer/input";

import {connect} from 'react-redux';
import {locationSelected} from '../actions/StoreActions.js';
import {getNearbyStores} from '../services/StoreLocatorService.js'

class LocationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.location};
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(event) {
    this.setState({value: event.target.value});
  }

  onBlur(event) {
    this.props.onLocationChanged(event.target.value);
  }

  render() {
    return (
      <PaperInput value={this.state.value} label="Location" placeHolder="Enter location..." onChange = { this.onChange } onBlur= {this.onBlur}/>
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
      dispatch(getNearbyStores(location));
    }
  }
}

export const LocationSelector = connect(mapStateToProps, mapDispatchToProps)(LocationInput);
