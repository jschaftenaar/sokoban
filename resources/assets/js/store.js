import { createStore, combineReducers } from 'redux'
import state from './reducers/state.js';
import level from './reducers/level.js';
import scenario from './reducers/scenario.js';
import user from './reducers/user.js';
import csrf from './reducers/csrf.js';

let reducers = combineReducers({
    state,
    scenario,
    level,
    user,
    csrf
});

let store = createStore(reducers);

export default store
