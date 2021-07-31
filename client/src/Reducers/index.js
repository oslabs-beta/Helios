import { combineReducers } from 'redux';
import mainReducer from './mainReducer.js';
import awsReducer from './awsReducer';
import awsReducerByFunc from './awsReducerbyFunc'
import apiReducer from './apiReducer.js';

const reducers = combineReducers({
  main: mainReducer,
  aws: awsReducer,
  awsByFunc: awsReducerByFunc,
  api: apiReducer,
});

export default reducers;
