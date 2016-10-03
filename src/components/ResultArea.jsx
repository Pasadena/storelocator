import ReactPolymer from "react-polymer";
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

ReactPolymer.registerAttribute('size');
ReactPolymer.registerAttribute('items');

class ResultAreaContainer extends React.Component {

    constructor(props) {
      super(props);
    }

    componentDidMount(props) {
      let grid = ReactDOM.findDOMNode(this);

      grid.columns = [
        { name: 'name' },
        { name: 'vicinity' },
        { name: 'openNow' },
        { name: 'distance' }
      ];
      grid.size = this.props.stores.length;
      grid.items = this.props.stores;
      console.log(this.props.stores);
    }

    componentDidUpdate(prevProps, prevState) {
      let grid = ReactDOM.findDOMNode(this);

      grid.size = this.props.stores.length;
      grid.items = this.props.stores;
    }

    render() {
      return React.createElement('vaadin-grid', null);
    }
}

const mapStateToProps = (state) => {
  return {
    stores: state.stores
  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export const ResultArea = connect(mapStateToProps, mapDispatchToProps)(ResultAreaContainer);
