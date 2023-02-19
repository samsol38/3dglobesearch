import Strings from "./Strings";
import Color from "./Color";
import Constants from "./Constants";
import ThemeUtils from "./ThemeUtils";

const toDegreesMinutesAndSeconds = (coordinate) => {
	let absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	let minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	return `${degrees}° ${minutes}' ${seconds}"`;
};

const degToDMS = (coordinate) => {
	let lat = parseFloat(coordinate?.latitude);
	let lng = parseFloat(coordinate?.longitude);

	let latitude = toDegreesMinutesAndSeconds(lat);
	let latitudeCardinal = lat >= 0 ? "N" : "S";

	let longitude = toDegreesMinutesAndSeconds(lng);
	let longitudeCardinal = lng >= 0 ? "E" : "W";

	return {
		latitude: `${latitude} ${latitudeCardinal}`,
		longitude: `${longitude} ${longitudeCardinal}`,
	};
};

const degToDMM = (coordinate) => {
	let lat = parseFloat(coordinate?.latitude);
	let lng = parseFloat(coordinate?.longitude);

	let latitude = toDegreesMinutesAndSecondsV2Latitude(lat);
	let longitude = toDegreesMinutesAndSecondsV2Longitude(lng);

	return {
		latitude: `${latitude}`,
		longitude: `${longitude}`,
	};
};

const toDegreesMinutesAndSecondsLatitude = (coordinate) => {
	let absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	let minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	let latitudeCardinal = coordinate >= 0 ? "N" : "S";

	return `${degrees}° ${minutes}' ${seconds}" ${latitudeCardinal}`;
};

const toDegreesMinutesAndSecondsLongitude = (coordinate) => {
	let absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	let minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	let longitudeCardinal = coordinate >= 0 ? "E" : "W";
	return `${degrees}° ${minutes}' ${seconds}" ${longitudeCardinal}`;
};

const toDegreesMinutesAndSecondsV2Latitude = (coordinate) => {
	let absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	let minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	let latitudeCardinal = coordinate >= 0 ? "N" : "S";
	return `${degrees}° ${minutesNotTruncated.toFixed(4)}' ${latitudeCardinal}`;
};

const toDegreesMinutesAndSecondsV2Longitude = (coordinate) => {
	let absolute = Math.abs(coordinate);
	let degrees = Math.floor(absolute);
	let minutesNotTruncated = (absolute - degrees) * 60;
	let minutes = Math.floor(minutesNotTruncated);
	let seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	let longitudeCardinal = coordinate >= 0 ? "E" : "W";
	return `${degrees}° ${minutesNotTruncated.toFixed(
		4
	)}' ${longitudeCardinal}`;
};

export {
	degToDMS,
	degToDMM,
	toDegreesMinutesAndSecondsLatitude,
	toDegreesMinutesAndSecondsLongitude,
	toDegreesMinutesAndSecondsV2Latitude,
	toDegreesMinutesAndSecondsV2Longitude,
};
