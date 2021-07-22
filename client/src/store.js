import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './Reducers/index.js';
import thunk from 'redux-thunk';

const composedEnhancer = composeWithDevTools(
  // Middleware
  applyMiddleware(thunk)
  
);

const store = createStore(reducers, composedEnhancer);

export default store;
