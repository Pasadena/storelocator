import ReactPolymer from "react-polymer";
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

ReactPolymer.registerAttribute('size');
ReactPolymer.registerAttribute('items');

class ResultAreaContainer extends React.Component {

    constructor(props) {
      super(props);
      this.createTableStructure = this.createTableStructure.bind(this);
    }

    componentDidMount(props) {
      let grid = ReactDOM.findDOMNode(this);

      grid.columns = [
        { name: 'Name' },
        { name: 'StreetAddress' },
        { name: 'OpenToday' }
      ];

      grid.size = this.props.stores.length;
      grid.items = this.props.stores;
    }

    componentDidUpdate(prevProps, prevState) {
      let grid = ReactDOM.findDOMNode(this);

      grid.size = this.props.stores.length;
      grid.items = this.props.stores;
    }

    createTableStructure() {
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>StreetAddress</th>
              <th>OpenToday</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      );
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
