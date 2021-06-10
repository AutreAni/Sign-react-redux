import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware  from 'redux-thunk';
import { createStore,applyMiddleware } from 'redux';
import currentUserReducer from './reducers/currentUserReducer';


const store = createStore(currentUserReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;