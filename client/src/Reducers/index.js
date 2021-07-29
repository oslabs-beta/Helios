import { combineReducers } from 'redux';
import mainReducer from './mainReducer.js';
import awsReducer from './awsReducer';
import apiReducer from './apiReducer.js';

const reducers = combineReducers({
  main: mainReducer,
  aws: awsReducer,
  api: apiReducer,
});

export default reducers;
