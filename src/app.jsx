import ReactPolymer from "react-polymer";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';

import {storeReducer} from './reducers/StoreReducers.js';

import {LocationSelector} from './components/LocationSelector';
import {VaadinDatePicker} from "./components/SelectedDatePicker";
import {ResultArea} from "./components/ResultArea";

import {getStoresWithGeolocation} from "./services/StoreLocatorService.js";

const store = createStore(storeReducer, applyMiddleware(thunk));

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadWithGeolocation();
  }

  render() {
    let content = this.props.isLoading ? <Loader /> : <Content />;
    return (
      <div style={{'width': '100%', 'height': '100%'}}>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    loadWithGeolocation:() => {
      dispatch(getStoresWithGeolocation());
    }
  }
}

const Content = () => (
  <div className="container">
    <div className="header">
      <h1>Store Locator <sup>TM</sup>
        <p className="slogan">Find the nearest stores</p>
      </h1>
    </div>
    <div className="inputs">
      <div className="content-left">
          <LocationSelector />
      </div>
      <div className="content-right">
          <VaadinDatePicker />
      </div>
    </div>
    <div className="results">
      <ResultArea />
    </div>
  </div>
);

const Loader = () => (
  <div className="container">
    <p>Loading...</p>
  </div>
);

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById("content")
);
