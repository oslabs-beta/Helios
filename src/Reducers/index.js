import { combineReducers } from 'redux';
import mainReducer from './mainReducer.js';
import awsReducer from './awsReducer';

const reducers = combineReducers({
  main: mainReducer,
  aws: awsReducer,
});

export default reducers;
