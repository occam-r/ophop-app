// // store/index.js
// import { createStore } from 'redux';
// import rootReducer from '../reducer/rootReducer';

// const store = createStore(rootReducer);

// export default store;



// store/index.js
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from '../reducer/rootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import rootReducer from '../reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
  whitelist: ['authReducer','themeReducer','baseReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware() // You can add middleware here if needed
);

const persistor = persistStore(store);

export { store, persistor };
