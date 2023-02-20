import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "./reducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
	key: "root",
	storage: storage,
	blacklist: ["userConfig", "isMasterAppLoading"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export let store = createStore(persistedReducer);

export let persistor = persistStore(store, null, () => {
	console.log("rehydrated");
});
