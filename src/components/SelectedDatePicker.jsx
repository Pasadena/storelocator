import ReactPolymer from "react-polymer";
import React from 'react';
import ReactDom from 'react-dom';
import {connect} from 'react-redux';
import {dateSelected} from '../actions/StoreActions.js';

class ElementsDatePicker extends React.Component {
  constructor(props) {
    super(props);
    let {selectedDate} = this.props;
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let realNode = ReactDom.findDOMNode(this);
    realNode.addEventListener('value-changed', this.onChange);
  }

  onChange(event) {
    console.log(event);
    this.props.dateSelected(event.target.value);
  }

  render() {
    return React.createElement('vaadin-date-picker', this.props);
  }
}

const mapStateToProps = (state) => {
  return {
    selectedDate: state.selectedDate
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dateSelected: (location) => {
      dispatch(dateSelected(location))
    }
  }
}

export const VaadinDatePicker = connect(mapStateToProps, mapDispatchToProps)(ElementsDatePicker);
