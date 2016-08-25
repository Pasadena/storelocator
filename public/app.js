"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactPolymer = require("react-polymer");

var _reactPolymer2 = _interopRequireDefault(_reactPolymer);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _input = require("react-polymer/input");

var _VaadinElements = require("./VaadinElements");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "container" },
        _react2.default.createElement(
          "p",
          null,
          "Hello Vaadin Elements World!"
        ),
        _react2.default.createElement(LocationInput, { location: "Foo" }),
        _react2.default.createElement(_VaadinElements.ElementsDatePicker, null)
      );
    }
  }]);

  return App;
}(_react2.default.Component);

var LocationInput = function (_React$Component2) {
  _inherits(LocationInput, _React$Component2);

  function LocationInput(props) {
    _classCallCheck(this, LocationInput);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(LocationInput).call(this, props));

    _this2.state = {
      location: _this2.props.location ? _this2.props.location : ""
    };
    return _this2;
  }

  _createClass(LocationInput, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(_input.PaperInput, { value: this.state.location, label: "Location", placeHolder: "Enter location...", onChange: function onChange(event) {
          return _this3.setState({ location: event.target.value });
        } });
    }
  }]);

  return LocationInput;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById("content"));