import {
    SET_USER_CONFIG,
    SET_USER_PREF
} from './action-types';

import { REHYDRATE } from 'redux-persist/src/constants';
import Constants from '../utils/Constants';

const {
    MasterDrawerMenuType,
    CoordinateFormat,
    SearchPlaceSectionType,
    PlaceType
} = Constants;

const initial = {
    userConfig: {
        selectedMenuType: MasterDrawerMenuType.Search
    },
    userPref: {
        appSettings: {
            coordinateFormat: CoordinateFormat.DecDeg,
            searchPlaceFrom: [
                PlaceType.City,
                PlaceType.State,
                PlaceType.Country
            ],
            searchPlaceSectionArray: [
                SearchPlaceSectionType.InputCoordinates,
                SearchPlaceSectionType.PlaceDetails,
                SearchPlaceSectionType.CountryDetails,
                SearchPlaceSectionType.TimeZoneDetails
            ]
        }
    },
};

const reducer = (state = initial, action) => {
    switch (action.type) {

        case SET_USER_CONFIG:
            return Object.assign({}, state, { userConfig: action.userConfig });

        case SET_USER_PREF:
            return Object.assign({}, state, { userPref: action.userPref });

        case REHYDRATE:
            return { ...state, ...action.payload };

        default:
            return state;
    }
};

export default reducer;
