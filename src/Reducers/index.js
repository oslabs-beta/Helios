import { combineReducers } from 'redux';
import mainReducer from './mainReducer.js';

const reducers = combineReducers({
  main: mainReducer,
});

export default reducers;
