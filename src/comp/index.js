import React, {
    lazy
} from 'react';

/*  Vendors  */

import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';
import { persistor, store } from './redux/store';
import Actions from './redux/action';

/*  Icons  */


/*  Assets  */


/*  Utils  */


import Strings from './utils/Strings';
import Color from './utils/Color';
import ThemeUtils from './utils/ThemeUtils';
import Constants from './utils/Constants';

import {
    degToDMS,
    degToDMM
} from './utils';

/*  UI  */


/*  View  */

import MasterContainer from './view/mastercontainer';

import DrawerView from './view/drawer';
import NavBarView from './view/navbar';
import MasterGlobeView from './view/globeview';
import SearchPlaceView from './view/searchplaceview';

import SettingsView from './view/settings';

/*  Other   */


export {

    /*  Start of Redux  */

    Provider,
    PersistGate,
    persistor,
    store,
    Actions,
    connect,

    /*  End of Redux  */


    /*  Start of Vendors  */


    /*  Icons  */


    /*  End of Vendors  */


    /*  Start of Assets  */


    /*  End of Assets  */


    /*  Start of UI */

    /*  UI  */


    /*  View  */

    MasterContainer,
    DrawerView,
    NavBarView,
    MasterGlobeView,
    SearchPlaceView,
    SettingsView,

    /*  Vendor  */

    /*  End of UI   */

    /*  Start of Utils  */

    Color,
    Strings,
    ThemeUtils,
    Constants,

    degToDMS,
    degToDMM,

    /*  End of Utils  */

    /*  Start of Other Constants */


    /*  End of Other Constants */

};
