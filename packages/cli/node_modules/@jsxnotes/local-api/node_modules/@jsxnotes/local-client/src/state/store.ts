import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

//Our custom middlewares
import { persistMiddleware } from './middlewares/persist-middleware';

//Integrate with Redux DevTools
import { composeWithDevTools } from 'redux-devtools-extension';
import * as actionCreators from './action-creators';

const composeEnhancers = composeWithDevTools({ actionCreators });

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk, persistMiddleware))
);

// export const store = createStore(reducers, {}, applyMiddleware(thunk));
