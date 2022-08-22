

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
        mainTitle: 'Search Place',
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

export default {
    MasterDrawerMenuType,
    MasterDrawerMenuConfig,
    MasterDrawerMenuArray,
    PlaceType,
    CoordinateFormat
};