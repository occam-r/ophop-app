// reducers/index.js
import { combineReducers } from 'redux';
import themeReducer from './theme_reducer';
import authReducer from './auth_reducer';
import baseReducer from './base_reducer';

const rootReducer = combineReducers({
    themeReducer: themeReducer,
    authReducer: authReducer,
    baseReducer: baseReducer
});

export default rootReducer;
