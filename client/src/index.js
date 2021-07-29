import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store.js';
import './Dashboard/assets/css/material-dashboard-react.css';
import { Spinner } from './Dashboard/variables/spinner';
//import 'assets/css/material-dashboard-react.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
