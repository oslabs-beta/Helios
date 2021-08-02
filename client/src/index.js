import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './store.js';
import './indexedDB/mainIdb';

import './Dashboard/assets/css/material-dashboard-react.css';
import './Dashboard/assets/scss/chart_legend.scss';
//import 'assets/css/material-dashboard-react.scss';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
