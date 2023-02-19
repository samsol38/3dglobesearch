import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "./reducer";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "root",
	storage: storage,
	blacklist: ["userConfig", "isMasterAppLoading"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export let store = createStore(persistedReducer);
// export let store = compose(autoRehydrate())(createStore)(persistedReducer)

// export let store = __DEV__ ? createStore(persistedReducer, __DEV__ &&
//     window.__REDUX_DEVTOOLS_EXTENSION__ &&
//     window.__REDUX_DEVTOOLS_EXTENSION__()) :
//     createStore(persistedReducer);

export let persistor = persistStore(store, null, () => {
	console.log("rehydrated");
});
