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
    }

    componentDidUpdate(prevProps, prevState) {
      let grid = ReactDOM.findDOMNode(this);

      grid.columns = [
        { name: 'Name' },
        { name: 'StreetAddress' },
        { name: 'OpenToday' }
      ];
      console.log(this.props.stores);

      grid.size = this.props.stores.length;
      /**this.props.stores.forEach( (store) => {
        realNode.push('items', store);
      });**/
      grid.items = this.props.stores;
      //realNode.refreshItems();
      //realNode.items = (params, callback) => callback(this.props.stores);
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
      //let tableStructure = this.createTableStructure();
      //return React.createElement('vaadin-grid', null, tableStructure);
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
