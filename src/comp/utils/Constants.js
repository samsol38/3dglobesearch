import Strings from "./Strings";

import {
	MdSearch,
	MdMap,
	MdLocationPin,
	MdAltRoute,
	MdOutlineAreaChart,
	MdSettings,
	MdOutlinePersonPin,
} from "react-icons/md";

import { FaGlobeAfrica } from "react-icons/fa";

const AppNotifKey = {
	SHOW_FAV_PLACE: "SHOW_FAV_PLACE",
};

const MasterDrawerMenuType = {
	Search: 1,
};

const MasterDrawerMenuConfig = {
	[MasterDrawerMenuType.Search]: {
		type: MasterDrawerMenuType.Search,
		title: "3D Globe Search",
		mainTitle: "3D Globe Search",
		icon: FaGlobeAfrica,
		route: "/",
	},
};

const MasterDrawerMenuArray = [MasterDrawerMenuType.Search];

const PlaceType = {
	City: 1,
	State: 2,
	Country: 3,
};

const CoordinateFormat = {
	DecDeg: "1",
	DegMinSec: "2",
	DegDecMin: "3",
};

const SearchPlaceSectionType = {
	InputCoordinates: 1,
	PlaceDetails: 2,
	CountryDetails: 3,
	TimeZoneDetails: 4,
	FavouritePlaces: 5,
};

export default {
	AppNotifKey,
	MasterDrawerMenuType,
	MasterDrawerMenuConfig,
	MasterDrawerMenuArray,
	PlaceType,
	CoordinateFormat,
	SearchPlaceSectionType,
};
