import ReactPolymer from "react-polymer";
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';

import {storeReducer} from './reducers/StoreReducers.js';

import {LocationSelector} from './components/LocationSelector';
import {VaadinDatePicker} from "./VaadinElements";
import {ResultArea} from "./components/ResultArea";

const store = createStore(storeReducer, applyMiddleware(thunk));

class App extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="container">
        <p>
          Hello Vaadin Elements World!!!!
        </p>
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
      </div>);
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("content")
);
