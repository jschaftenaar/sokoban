import { createStore, combineReducers } from 'redux'
import state from './reducers/state.js';
import level from './reducers/level.js';
import scenario from './reducers/scenario.js';

let reducers = combineReducers({
  state,
  scenario,
  level
});

let store = createStore(reducers);

export default store
