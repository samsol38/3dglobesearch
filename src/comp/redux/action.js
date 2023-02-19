import {
	SET_USER_CONFIG,
	SET_USER_PREF,
	SET_MASTER_APP_LOADING,
} from "./action-types";

const setUserConfig = (userConfig) => ({ type: SET_USER_CONFIG, userConfig });
const setUserPref = (userPref) => ({ type: SET_USER_PREF, userPref });
const setIsMasterAppLoading = (isMasterAppLoading) => ({
	type: SET_MASTER_APP_LOADING,
	isMasterAppLoading,
});

export default {
	setUserConfig,
	setUserPref,
	setIsMasterAppLoading,
};
