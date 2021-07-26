import { combineReducers } from 'redux';
import mainReducer from './mainReducer.js';
import awsReducer from './awsReducer';
import awsReducerByFunc from './awsReducerbyFunc'

const reducers = combineReducers({
  main: mainReducer,
  aws: awsReducer,
  awsByfunc: awsReducerByFunc,
});

export default reducers;
