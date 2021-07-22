import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './Reducers/index.js';
import thunk from 'redux-thunk';


const store = createStore(reducers, composeWithDevTools(
   // applyMiddleware(thunk)
    // other store enhancers if any
  ));

export default store;
