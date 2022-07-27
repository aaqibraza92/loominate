import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import middleware from "./middleware";
import rootReducer from "./reducers/root.reducer";

const initialState = {};
const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth']
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer, initialState);
export const store = createStore(persistedReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);

