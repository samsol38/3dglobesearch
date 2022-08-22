import {
    SET_USER_CONFIG,
    SET_USER_PREF
} from './action-types';

import { REHYDRATE } from 'redux-persist/src/constants';
import Constants from '../utils/Constants';

const {
    MasterDrawerMenuType
} = Constants;

let initial = {
    // userConfig: {
    //     selectedMenuType: MasterDrawerMenuType.Search
    // },
    userPref: {},
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
