

import Strings from './Strings';

import {
    MdSearch,
    MdMap,
    MdLocationPin,
    MdAltRoute,
    MdOutlineAreaChart,
    MdSettings,
    MdOutlinePersonPin
} from 'react-icons/md';

const FirebaseConfig = {
    apiKey: "AIzaSyDiifqzOuivaprBq5L4Us0DYqKqiYUaDdg",
    authDomain: "webapps-b7f67.firebaseapp.com",
    projectId: "webapps-b7f67",
    storageBucket: "webapps-b7f67.appspot.com",
    messagingSenderId: "565126622407",
    appId: "1:565126622407:web:1e61e6c70044f5cd3f22e2",
    measurementId: "G-QLG1WWSVGL"
};

const AppNotifKey = {
    SHOW_FAV_PLACE: 'SHOW_FAV_PLACE',
}

const MasterDrawerMenuType = {
    Search: 1,
    Location: 2,
    Path: 3,
    Area: 4,
    Options: 5,
    About: 10
};

const MasterDrawerMenuConfig = {
    [MasterDrawerMenuType.Search]: {
        type: MasterDrawerMenuType.Search,
        title: 'Search',
        mainTitle: '3D Globe Search',
        icon: MdSearch
    },
    [MasterDrawerMenuType.Location]: {
        type: MasterDrawerMenuType.Location,
        title: 'Location',
        mainTitle: `Find Location's Coordinate`,
        icon: MdLocationPin
    },
    [MasterDrawerMenuType.Path]: {
        type: MasterDrawerMenuType.Path,
        title: 'Path',
        mainTitle: 'Find Distance Between Places',
        icon: MdAltRoute
    },
    [MasterDrawerMenuType.Area]: {
        type: MasterDrawerMenuType.Area,
        title: 'Area',
        mainTitle: 'Find Area Between Places',
        icon: MdOutlineAreaChart
    },
    [MasterDrawerMenuType.Options]: {
        type: MasterDrawerMenuType.Options,
        title: 'Settings',
        mainTitle: 'Settings',
        icon: MdSettings
    },
    [MasterDrawerMenuType.About]: {
        type: MasterDrawerMenuType.About,
        title: 'About',
        mainTitle: 'About',
        icon: MdOutlinePersonPin
    }
};

const MasterDrawerMenuArray = [
    MasterDrawerMenuType.Search,
    // MasterDrawerMenuType.Location,
    // MasterDrawerMenuType.Path,
    // MasterDrawerMenuType.Area,
    // MasterDrawerMenuType.Options,
    // MasterDrawerMenuType.About
];

const PlaceType = {
    City: 1,
    State: 2,
    Country: 3
}

const CoordinateFormat = {
    DecDeg: '1',
    DegMinSec: '2',
    DegDecMin: '3'
}

const SearchPlaceSectionType = {
    InputCoordinates: 1,
    PlaceDetails: 2,
    CountryDetails: 3,
    TimeZoneDetails: 4,
    FavouritePlaces: 5
}

export default {
    FirebaseConfig,
    AppNotifKey,
    MasterDrawerMenuType,
    MasterDrawerMenuConfig,
    MasterDrawerMenuArray,
    PlaceType,
    CoordinateFormat,
    SearchPlaceSectionType
};