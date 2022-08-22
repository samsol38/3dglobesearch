import {
    SET_USER_CONFIG,
    SET_USER_PREF
} from './action-types';

import { REHYDRATE } from 'redux-persist/src/constants';

import Constants from '../utils/Constants';

const {
    MasterDrawerMenuType,
    CoordinateFormat
} = Constants;

let initialState = {
    userPref: {
        appSettings: {
            coordinateFormat: CoordinateFormat.DecDeg,
            searchPlaceFrom: {
                city: true,
                state: true,
                country: true
            }
        }
    },
    userConfig: {
        selectedMenuType: MasterDrawerMenuType.Search
    },
};

const setUserConfig = (userConfig) => ({ type: SET_USER_CONFIG, userConfig });
const setUserPref = (userPref) => ({ type: SET_USER_PREF, userPref });

export default {
    setUserConfig,
    setUserPref
};