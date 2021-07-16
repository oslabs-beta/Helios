import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './Reducers/index.js';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
