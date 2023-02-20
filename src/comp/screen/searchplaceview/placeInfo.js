import React, { Fragment, useState, useEffect, useRef } from "react";

import {
	useColorMode,
	Box,
	Text,
	Flex,
	IconButton,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Code,
	Divider,
	Tooltip,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Spacer,
	Icon,
} from "@chakra-ui/react";

import { InfoIcon } from "@chakra-ui/icons";

import { BsFillStarFill } from "react-icons/bs";

import { MdLocationPin } from "react-icons/md";

import { connect } from "react-redux";

import lodash from "lodash";
import tzlookup from "tz-lookup";
import Clock from "react-live-clock";

import {
	degToDMS,
	degToDMM,
	toDegreesMinutesAndSecondsV2Latitude,
	toDegreesMinutesAndSecondsV2Longitude,
	toDegreesMinutesAndSecondsLatitude,
	toDegreesMinutesAndSecondsLongitude,
} from "../../utils";

import CoordinateInputView from "./coordinateInput";

import Actions from "../../redux/action";
import Constants from "../../utils/Constants";
import AppManager from "../../utils/AppManager";

import PhoneNumArray from "../../data/info/phone-num.json";
import PostalCodeArray from "../../data/info/postal-codes.json";

const { PlaceType, CoordinateFormat, SearchPlaceSectionType } = Constants;

const MasterPlaceConfig = {
	[PlaceType.Country]: {
		name: {
			title: "Name",
		},
		native: {
			title: "Native Name",
		},
		capital: {
			title: "Capital",
		},
		region: {
			title: "Region",
		},
		subregion: {
			title: "Sub-Region",
		},
		emoji: {
			title: "Emoji",
		},
		emojiU: {
			title: "EmojiU",
		},
		iso3: {
			title: "ISO3",
		},
		iso2: {
			title: "ISO2",
		},
		tld: {
			title: "Domain",
		},
		currency_name: {
			title: "Currency Name",
		},
		currency: {
			title: "Currency Code",
		},
		currency_symbol: {
			title: "Currency Symbol",
		},
		numeric_code: {
			title: "Numeric Code",
		},
		phone_code: {
			title: "Phone Code",
		},
	},
};

const TimeZoneConfig = {
	zoneName: {
		title: "Zone",
	},
	gmtOffset: {
		title: "GMT Offset",
	},
	gmtOffsetName: {
		title: "UTC Offset",
	},
	abbreviation: {
		title: "Short Form",
	},
	tzName: {
		title: "Full Form",
	},
};

const PlaceInfoView = (props) => {
	const {
		userConfig,
		userPref,
		placeItem,
		isPlaceVisible,
		selectedPlaceCoordinate,
	} = props;

	const { colorMode } = useColorMode();

	const [state, setState] = useState({
		placeDetailsObj: null,
		countryDetailsObj: null,
		timeZoneArray: [],
		defaultIndex: [0],
		favPlaceArray: userPref?.favPlaceArray ?? [],
		favPlaceDisplayArray: [],
	});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	const [coordinate, setCoordinate] = useState({
		latitude: 0.0,
		longitude: 0.0,
	});

	const updateCoordinate = (data) =>
		setCoordinate((preState) => ({ ...preState, ...data }));

	let currentTimeZoneIndex = useRef(null);

	/*  Life-cycles Methods */

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		showInfo();
	}, [placeItem]);

	useEffect(() => {
		showInfo();
	}, [userPref]);

	useEffect(() => {
		if (!lodash.isNil(selectedPlaceCoordinate)) {
			updateCoordinate({
				...selectedPlaceCoordinate,
			});
		}
	}, [selectedPlaceCoordinate]);

	/*  Public Interface Methods */

	const isSearchPlaceSectionWithinSettings = (type) => {
		let appSettingObj = userPref?.appSettings ?? {};
		let searchPlaceSectionArray =
			appSettingObj?.searchPlaceSectionArray ?? [
				SearchPlaceSectionType.InputCoordinates,
				SearchPlaceSectionType.PlaceDetails,
				SearchPlaceSectionType.CountryDetails,
				SearchPlaceSectionType.TimeZoneDetails,
				SearchPlaceSectionType.FavouritePlaces,
			];

		return searchPlaceSectionArray.includes(type);
	};

	const showInfo = async () => {
		await showPlaceInfo();
		await showFavPlaces();
	};

	const showPlaceInfo = async () => {
		return new Promise(async (resolve, reject) => {
			if (!lodash.isNil(placeItem)) {
				getPlaceDetails();
			} else {
				await updateState({
					placeDetailsObj: null,
					countryDetailsObj: null,
					timeZoneArray: [],
					defaultIndex: [0],
				});
			}

			resolve();
		});
	};

	const showFavPlaces = async () => {
		return new Promise(async (resolve, reject) => {
			let favPlaceArray = (userPref?.favPlaceArray ?? []).slice();
			let favPlaceDisplayArray = [];

			favPlaceArray.forEach((placeObj, index) => {
				let currentPlaceItem = getPlaceDetailsFromPlaceItem(placeObj);
				currentPlaceItem = Object.assign({}, currentPlaceItem);
				favPlaceDisplayArray.push(currentPlaceItem);
			});

			await updateState({
				favPlaceArray: favPlaceArray,
				favPlaceDisplayArray: favPlaceDisplayArray,
			});

			resolve();
		});
	};

	const getLatLongInFormat = (inputCoordinate) => {
		let coordinateFormat =
			userPref?.appSettings?.coordinateFormat ?? CoordinateFormat.DecDeg;

		let outputCoordinate = {};

		switch (coordinateFormat) {
			case CoordinateFormat.DecDeg: {
				outputCoordinate = inputCoordinate;
				break;
			}

			case CoordinateFormat.DegMinSec: {
				outputCoordinate = degToDMS(inputCoordinate);
				break;
			}

			case CoordinateFormat.DegDecMin: {
				outputCoordinate = degToDMM(inputCoordinate);
				break;
			}

			default: {
				break;
			}
		}

		return outputCoordinate;
	};

	const getPlaceDetails = () => {
		let currentPlaceItem = Object.assign({}, placeItem);

		let placeType = currentPlaceItem?.type;
		let placeDetailsObj = {};

		let inputCoordinate = {
			latitude: currentPlaceItem?.latitude,
			longitude: currentPlaceItem?.longitude,
		};

		let outputCoordinate = getLatLongInFormat(inputCoordinate);

		currentPlaceItem = {
			...currentPlaceItem,
			...outputCoordinate,
		};

		switch (placeType) {
			case PlaceType.Country: {
				setCountryDetails(currentPlaceItem);

				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "Country",
					},
					latitude: {
						type: "latitude",
						title: "Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Longitude",
						value: currentPlaceItem?.longitude,
					},
				};

				break;
			}

			case PlaceType.State: {
				setCountryDetails(currentPlaceItem?.countryItem);

				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "State",
					},
					address: {
						type: "address",
						title: "Address",
						value: currentPlaceItem?.address,
					},
					stateCode: {
						type: "stateCode",
						title: "State Code",
						value: currentPlaceItem?.state_code,
					},
					countryName: {
						type: "countryName",
						title: "Country",
						value: currentPlaceItem?.countryItem?.name,
					},
					latitude: {
						type: "latitude",
						title: "Place Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Place Longitude",
						value: currentPlaceItem?.longitude,
					},
				};

				break;
			}

			case PlaceType.City: {
				setCountryDetails(currentPlaceItem?.countryItem);

				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "City",
					},
					address: {
						type: "address",
						title: "Address",
						value: currentPlaceItem?.address,
					},
					latitude: {
						type: "latitude",
						title: "Place Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Place Longitude",
						value: currentPlaceItem?.longitude,
					},
					stateName: {
						type: "stateName",
						title: "State",
						value: currentPlaceItem?.stateItem?.name,
					},
					stateCode: {
						type: "stateCode",
						title: "State Code",
						value: currentPlaceItem?.stateItem?.state_code,
					},
					countryName: {
						type: "countryName",
						title: "Country",
						value: currentPlaceItem?.countryItem?.name,
					},
				};

				break;
			}
		}

		let timezoneByPlace = tzlookup(
			placeItem?.latitude,
			placeItem?.longitude
		);

		placeDetailsObj = {
			...placeDetailsObj,
			timeZone: {
				type: "timeZone",
				title: "TimeZone",
				value: timezoneByPlace,
			},
		};

		placeDetailsObj = {
			...placeDetailsObj,
			currentDate: {
				type: "currentDate",
				title: "Current Date",
				format: "Do MMM, YYYY, ddd",
				ticking: false,
				blinking: false,
				value: timezoneByPlace,
			},
		};

		placeDetailsObj = {
			...placeDetailsObj,
			currentTime: {
				type: "currentTime",
				title: "Current Time",
				format: "hh:mm:ss a",
				// format: 'hh:mm a',
				ticking: true,
				blinking: false,
				value: timezoneByPlace,
			},
		};

		updateState({
			placeDetailsObj: placeDetailsObj,
		});

		updateCoordinate({
			latitude: placeItem?.latitude,
			longitude: placeItem?.longitude,
		});
	};

	const getPlaceDetailsFromPlaceItem = (placeItemObj) => {
		let currentPlaceItem = Object.assign({}, placeItemObj);

		let placeType = currentPlaceItem?.type;
		let placeDetailsObj = {};

		let inputCoordinate = {
			latitude: currentPlaceItem?.latitude,
			longitude: currentPlaceItem?.longitude,
		};

		let outputCoordinate = getLatLongInFormat(inputCoordinate);

		currentPlaceItem = {
			...currentPlaceItem,
			...outputCoordinate,
		};

		switch (placeType) {
			case PlaceType.Country: {
				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "Country",
					},
					latitude: {
						type: "latitude",
						title: "Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Longitude",
						value: currentPlaceItem?.longitude,
					},
				};

				break;
			}

			case PlaceType.State: {
				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "State",
					},
					address: {
						type: "address",
						title: "Address",
						value: currentPlaceItem?.address,
					},
					latitude: {
						type: "latitude",
						title: "Place Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Place Longitude",
						value: currentPlaceItem?.longitude,
					},
				};

				break;
			}

			case PlaceType.City: {
				placeDetailsObj = {
					name: {
						type: "name",
						title: "Name",
						value: currentPlaceItem?.name,
					},
					placeType: {
						type: "placeType",
						title: "Place Type",
						value: "City",
					},
					address: {
						type: "address",
						title: "Address",
						value: currentPlaceItem?.address,
					},
					latitude: {
						type: "latitude",
						title: "Latitude",
						value: currentPlaceItem?.latitude,
					},
					longitude: {
						type: "longitude",
						title: "Longitude",
						value: currentPlaceItem?.longitude,
					},
				};

				break;
			}
		}

		let timezoneByPlace = tzlookup(
			placeItemObj?.latitude,
			placeItemObj?.longitude
		);

		placeDetailsObj = {
			...placeDetailsObj,
			timeZone: {
				type: "timeZone",
				title: "TimeZone",
				value: timezoneByPlace,
			},
		};

		placeDetailsObj = {
			...placeDetailsObj,
			currentDate: {
				type: "currentDate",
				title: "Current Date",
				format: "Do MMM, YYYY, ddd",
				ticking: false,
				blinking: false,
				value: timezoneByPlace,
			},
		};

		placeDetailsObj = {
			...placeDetailsObj,
			currentTime: {
				type: "currentTime",
				title: "Current Time",
				format: "hh:mm:ss a",
				// format: 'hh:mm a',
				ticking: true,
				blinking: false,
				value: timezoneByPlace,
			},
		};

		return placeDetailsObj;
	};

	const setCountryDetails = (countryItem) => {
		let inputCoordinate = {
			latitude: countryItem?.latitude,
			longitude: countryItem?.longitude,
		};

		let outputCoordinate = getLatLongInFormat(inputCoordinate);

		countryItem = {
			...countryItem,
			...outputCoordinate,
		};

		let placeConfigObj = Object.assign(
			{},
			MasterPlaceConfig[PlaceType.Country]
		);
		let placeDetailsObj = {};

		for (let key in placeConfigObj) {
			if (
				!lodash.isNil(countryItem[key]) &&
				lodash.isString(countryItem[key]) &&
				countryItem[key]?.trim() !== ""
			) {
				placeDetailsObj = {
					...placeDetailsObj,
					[key]: {
						...placeConfigObj[key],
						type: key,
						value: countryItem[key],
					},
				};
			}
		}

		let phoneNumRegex = getPhoneNumFormat(countryItem);

		if (
			!lodash.isNil(phoneNumRegex) &&
			lodash.isString(phoneNumRegex) &&
			phoneNumRegex.trim() !== ""
		) {
			placeDetailsObj = {
				...placeDetailsObj,
				phoneNum: {
					type: "phoneNum",
					title: "Phone Format",
					value: phoneNumRegex,
				},
			};
		}

		let postalCodeObj = getPostalCodeFormat(countryItem);

		if (!lodash.isNil(postalCodeObj)) {
			placeDetailsObj = {
				...placeDetailsObj,
				zipCodeFormat: {
					type: "zipCodeFormat",
					title: "ZipCode Format",
					value: postalCodeObj?.Format,
				},
			};

			if (
				!lodash.isNil(postalCodeObj?.Regex) &&
				lodash.isString(postalCodeObj?.Regex) &&
				postalCodeObj?.Regex.trim() !== ""
			) {
				placeDetailsObj = {
					...placeDetailsObj,
					zipCodeRegex: {
						type: "zipCodeFormat",
						title: "ZipCode Regex",
						value: postalCodeObj?.Regex,
					},
				};
			}
		}

		let timeZoneArray = getTimeZones(countryItem);

		updateState({
			countryDetailsObj: placeDetailsObj,
			timeZoneArray: timeZoneArray,
			defaultIndex: [0],
		});
	};

	const getTimeZones = (countryItem) => {
		let timezoneByPlace = tzlookup(
			placeItem?.latitude,
			placeItem?.longitude
		);

		let timeZoneArray = countryItem?.timezones ?? [];
		let masterTimeZoneArray = [];

		currentTimeZoneIndex.current = -1;

		timeZoneArray.forEach((item, index) => {
			let timeZoneObj = {};
			for (let key in item) {
				if (
					!lodash.isNil(item[key]) &&
					lodash.isString(`${item[key]}`) &&
					`${item[key]}`.trim() !== ""
				) {
					if (
						key === "zoneName" &&
						timezoneByPlace.toLowerCase() ===
							item[key].toLowerCase()
					) {
						currentTimeZoneIndex.current = index;
					}
					timeZoneObj = {
						...timeZoneObj,
						[key]: {
							...TimeZoneConfig[key],
							type: key,
							value: `${item[key]}`,
						},
					};
				}
			}

			let zoneName = timeZoneObj["zoneName"]["value"];

			timeZoneObj = {
				...timeZoneObj,
				currentTime: {
					type: "currentTime",
					title: "Current Time",
					format: "hh:mm:ss a",
					// format: 'hh:mm a',
					ticking: true,
					blinking: false,
					value: zoneName,
				},
			};

			masterTimeZoneArray.push(timeZoneObj);
		});

		return masterTimeZoneArray;
	};

	const getPhoneNumFormat = (countryItem) => {
		let phoneNumArray = PhoneNumArray.slice();
		let countryCode = countryItem?.iso2;
		let phoneNumRegex = null;

		let filteredPhoneNumArray = phoneNumArray.filter((item) => {
			return item[1].toLowerCase() === countryCode.toLowerCase();
		});

		if (filteredPhoneNumArray.length > 0) {
			phoneNumRegex = filteredPhoneNumArray[0][3];
		}
		return phoneNumRegex;
	};

	const getPostalCodeFormat = (countryItem) => {
		let postalCodeArray = PostalCodeArray.slice();
		let countryCode = countryItem?.iso2;
		let postalCodeObj = null;

		let filteredPostalCodeArray = postalCodeArray.filter((item) => {
			return item.ISO.toLowerCase() === countryCode.toLowerCase();
		});

		if (filteredPostalCodeArray.length > 0) {
			postalCodeObj = filteredPostalCodeArray[0];
		}

		return postalCodeObj;
	};

	/*  UI Events Methods   */

	const onChangeLatitudeValue = (value) => {
		updateCoordinate({
			latitude: value,
		});
	};

	const onChangeLongitudeValue = (value) => {
		updateCoordinate({
			longitude: value,
		});
	};

	const onChangeLatitudeValueEnd = (value) => {
		let updatedCoordinates = {
			latitude: value,
			longitude: coordinate?.longitude,
		};

		updateCoordinate({
			latitude: value,
		});

		props.setUserConfig({
			...userConfig,
			selectedPlaceItem: null,
			selectedInputCoordinate: updatedCoordinates,
		});
	};

	const onChangeLongitudeValueEnd = (value) => {
		let updatedCoordinates = {
			latitude: coordinate?.latitude,
			longitude: value,
		};

		updateCoordinate({
			longitude: value,
		});

		props.setUserConfig({
			...userConfig,
			selectedPlaceItem: null,
			selectedInputCoordinate: updatedCoordinates,
		});
	};

	const onPressMakeUnFavItem = async (favPlaceObj, index) => {
		let favPlaceArray = (userPref?.favPlaceArray ?? []).slice();
		favPlaceArray.splice(index, 1);

		await props.setUserPref({
			...userPref,
			favPlaceArray: favPlaceArray.slice(),
		});
	};

	const onPressShowFavItem = async (favPlaceObj, index) => {
		let favPlaceArray = userPref?.favPlaceArray ?? [];
		let searchFavPlaceItem = favPlaceArray[index];

		AppManager.getInstance().showFavPlaceItem(searchFavPlaceItem);
	};

	/*  Server Request Methods  */

	/*  Server Response Methods  */

	/*  Server Response Handler Methods  */

	/*  Custom-Component sub-render Methods */

	const renderCoordinateInput = () => {
		const latitudeInputFormat = {
			min: -90,
			max: 90,
			defaultValue: 0,
			precision: 8,
			step: 0.00000001,
		};

		const longitudeInputFormat = {
			min: -180,
			max: 180,
			defaultValue: 0,
			precision: 8,
			step: 0.00000001,
		};

		return (
			<Flex flexDirection={"column"}>
				<CoordinateInputView
					key={1}
					updatedValue={coordinate?.latitude}
					title={"Latitude"}
					inputFormat={latitudeInputFormat}
					onChangeValue={onChangeLatitudeValue}
					onChangeValueEnd={onChangeLatitudeValueEnd}
				/>
				<Divider marginY={4} />
				<CoordinateInputView
					key={2}
					updatedValue={coordinate?.longitude}
					title={"Longitude"}
					inputFormat={longitudeInputFormat}
					onChangeValue={onChangeLongitudeValue}
					onChangeValueEnd={onChangeLongitudeValueEnd}
				/>
			</Flex>
		);
	};

	const renderLatLongTable = () => {
		const latLngValueSize = "x-small";

		return (
			<TableContainer
				mt={2}
				overflowX={"auto"}
			>
				<Table size="sm">
					<Thead>
						<Tr>
							<Th>Format</Th>
							<Th textAlign="center">Latitude</Th>
							<Th textAlign="center">Longitude</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td textAlign="left">
								<Tooltip
									hasArrow
									// color='white'
									placement="top"
									label={"Decimal Degrees"}
								>
									DD
								</Tooltip>
							</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${coordinate?.latitude ?? 0}`}</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${coordinate?.longitude ?? 0}`}</Td>
						</Tr>
						<Tr>
							<Td textAlign="left">
								<Tooltip
									hasArrow
									// color='white'
									placement="top"
									label={"Degrees, Minutes & Seconds"}
								>
									DMS
								</Tooltip>
							</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${toDegreesMinutesAndSecondsLatitude(
								coordinate?.latitude ?? 0
							)}`}</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${toDegreesMinutesAndSecondsLongitude(
								coordinate?.longitude ?? 0
							)}`}</Td>
						</Tr>
						<Tr>
							<Td textAlign="left">
								<Tooltip
									hasArrow
									// color='white'
									placement="top"
									label={"Degrees & Decimal Minutes"}
								>
									DDM
								</Tooltip>
							</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${toDegreesMinutesAndSecondsV2Latitude(
								coordinate?.latitude ?? 0
							)}`}</Td>
							<Td
								textAlign="center"
								fontSize={latLngValueSize}
							>{`${toDegreesMinutesAndSecondsV2Longitude(
								coordinate?.longitude ?? 0
							)}`}</Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
		);
	};

	const renderCoordinateMasterInput = () => {
		return (
			<AccordionItem key={0}>
				<AccordionButton
					bg={colorMode === "dark" ? "gray.700" : "gray.100"}
				>
					<Box
						width={"100%"}
						fontSize={"md"}
						fontWeight={"medium"}
						textAlign="left"
					>
						{`Input Coordinates`}
					</Box>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel>
					<Box
						overflowY={"auto"}
						overflowX={"auto"}
					>
						{renderCoordinateInput()}
						<Divider
							mt={4}
							mb={0}
						/>
						{renderLatLongTable()}
					</Box>
				</AccordionPanel>
			</AccordionItem>
		);
	};

	const renderPlaceProperty = (propertyItem, key) => {
		if (lodash.isNil(propertyItem?.value)) {
			return;
		}

		return (
			<Flex
				key={`${propertyItem?.type}-${key}`}
				flexDirection="row"
				alignItems={"center"}
				justifyContent={"space-between"}
				mb={2}
			>
				<Text fontSize={"sm"}>{`${propertyItem?.title}`}</Text>
				<Flex
					justify={"center"}
					alignItems={"center"}
					flexGrow={1}
					marginX={"5px"}
				>
					<Divider minWidth={20} />
				</Flex>
				{!lodash.isNil(propertyItem?.type) &&
				[
					"currentDateV1",
					"currentDateV2",
					"currentDate",
					"currentTime",
				].includes(propertyItem?.type) ? (
					<Code
						fontSize={"sm"}
						textAlign={"right"}
						colorScheme="purple"
					>
						<Clock
							format={propertyItem?.format}
							ticking={propertyItem?.ticking}
							blinking={propertyItem?.blinking}
							timezone={propertyItem?.value}
						/>
					</Code>
				) : (
					<Code
						fontSize={"sm"}
						textAlign={"right"}
						colorScheme="linkedin"
					>
						{`${propertyItem?.value}`.trim()}
					</Code>
				)}
			</Flex>
		);
	};

	const renderTimeZoneProperty = (propertyItem, index) => {
		if (lodash.isNil(propertyItem?.value)) {
			return;
		}

		return (
			<>
				<Flex
					key={`TimeZone-${propertyItem?.value}-${index}`}
					flexDirection="row"
					alignItems={"center"}
					justifyContent={"space-between"}
					mb={2}
				>
					<Text fontSize={"sm"}>{`${propertyItem?.title}`}</Text>
					<Flex
						justify={"center"}
						alignItems={"center"}
						// height={1}
						flexGrow={1}
						marginX={"5px"}
					>
						<Divider zIndex={0} />
					</Flex>
					{!lodash.isNil(propertyItem?.type) &&
					["currentTime"].includes(propertyItem?.type) ? (
						<Code
							fontSize={"sm"}
							textAlign={"right"}
							colorScheme="purple"
						>
							<Clock
								format={propertyItem?.format}
								ticking={propertyItem?.ticking}
								blinking={propertyItem?.blinking}
								timezone={propertyItem?.value}
							/>
						</Code>
					) : (
						<Code
							fontSize={"sm"}
							textAlign={"right"}
							colorScheme="linkedin"
						>
							{`${propertyItem?.value}`.trim()}
						</Code>
					)}
				</Flex>
			</>
		);
	};

	const renderFavPlaceProperty = (propertyItem, index) => {
		if (lodash.isNil(propertyItem?.value)) {
			return;
		}

		return (
			<>
				<Flex
					key={`FavPlace-${propertyItem?.value}-${index}`}
					flexDirection="row"
					alignItems={"center"}
					justifyContent={"space-between"}
					mb={2}
				>
					<Text fontSize={"sm"}>{`${propertyItem?.title}`}</Text>
					<Flex
						justify={"center"}
						alignItems={"center"}
						// height={1}
						flexGrow={1}
						marginX={"5px"}
					>
						<Divider zIndex={0} />
					</Flex>
					{!lodash.isNil(propertyItem?.type) &&
					[
						"currentDateV1",
						"currentDateV2",
						"currentDate",
						"currentTime",
					].includes(propertyItem?.type) ? (
						<Code
							fontSize={"sm"}
							textAlign={"right"}
							colorScheme="purple"
						>
							<Clock
								format={propertyItem?.format}
								ticking={propertyItem?.ticking}
								blinking={propertyItem?.blinking}
								timezone={propertyItem?.value}
							/>
						</Code>
					) : (
						<Code
							fontSize={"sm"}
							textAlign={"right"}
							colorScheme="linkedin"
						>
							{`${propertyItem?.value}`.trim()}
						</Code>
					)}
				</Flex>
			</>
		);
	};

	const renderPlaceInfo = () => {
		return (
			<Accordion
				flex={1}
				overflowX={"hidden"}
				overflowY={"auto"}
				allowMultiple
				defaultIndex={[0]}
			>
				{isSearchPlaceSectionWithinSettings(
					SearchPlaceSectionType.InputCoordinates
				) && renderCoordinateMasterInput()}
				{!lodash.isNil(state?.countryDetailsObj) && isPlaceVisible && (
					<>
						{isSearchPlaceSectionWithinSettings(
							SearchPlaceSectionType.PlaceDetails
						) && (
							<AccordionItem key={1}>
								<AccordionButton
									bg={
										colorMode === "dark"
											? "gray.700"
											: "gray.100"
									}
								>
									<Box
										width={"100%"}
										fontSize={"md"}
										fontWeight={"medium"}
										textAlign="left"
									>
										{`Place Details - ${placeItem?.name}`}
									</Box>
									<AccordionIcon />
								</AccordionButton>
								<AccordionPanel>
									<Box overflowY={"auto"}>
										{Object.keys(
											state?.placeDetailsObj
										).map((item, index) => {
											return renderPlaceProperty(
												state?.placeDetailsObj[item],
												`place${index}`
											);
										})}
									</Box>
								</AccordionPanel>
							</AccordionItem>
						)}
						{isSearchPlaceSectionWithinSettings(
							SearchPlaceSectionType.CountryDetails
						) && (
							<AccordionItem key={2}>
								<AccordionButton
									bg={
										colorMode === "dark"
											? "gray.700"
											: "gray.100"
									}
								>
									<Box
										width={"100%"}
										fontSize={"md"}
										fontWeight={"medium"}
										textAlign="left"
									>
										{`Country Details - ${state?.countryDetailsObj?.name?.value}`}
									</Box>
									<AccordionIcon />
								</AccordionButton>
								<AccordionPanel>
									<Box overflowY={"auto"}>
										{Object.keys(
											state?.countryDetailsObj
										).map((item, index) => {
											return renderPlaceProperty(
												state?.countryDetailsObj[item],
												`country${index}`
											);
										})}
									</Box>
								</AccordionPanel>
							</AccordionItem>
						)}
						{isSearchPlaceSectionWithinSettings(
							SearchPlaceSectionType.TimeZoneDetails
						) && (
							<AccordionItem key={3}>
								<AccordionButton
									bg={
										colorMode === "dark"
											? "gray.700"
											: "gray.100"
									}
								>
									<Box
										width={"100%"}
										fontSize={"md"}
										fontWeight={"medium"}
										textAlign="left"
									>
										{`TimeZone Details - (${state?.timeZoneArray.length})`}
									</Box>
									<AccordionIcon />
								</AccordionButton>
								<AccordionPanel>
									<Box>
										{(state?.timeZoneArray ?? []).map(
											(timezoneObj, index) => {
												return (
													<Box
														paddingY={1}
														key={`timezone-${index}`}
													>
														{(
															state?.timeZoneArray ??
															[]
														).length > 1 && (
															<Box
																alignItems={
																	"center"
																}
																justifyContent={
																	"center"
																}
															>
																<Text
																	as="u"
																	fontWeight={
																		"medium"
																	}
																	align={
																		"center"
																	}
																	fontSize={
																		"md"
																	}
																>{`TimeZone ${
																	index + 1
																}`}</Text>
																{currentTimeZoneIndex.current ===
																	index && (
																	<Tooltip
																		hasArrow
																		placement="top"
																		label={
																			"Current TimeZone By Place"
																		}
																	>
																		<InfoIcon
																			ms={
																				2
																			}
																		/>
																	</Tooltip>
																)}
															</Box>
														)}
														<Box mt={2}>
															{Object.keys(
																timezoneObj
															).map(
																(
																	item,
																	timeIndex
																) => {
																	return renderTimeZoneProperty(
																		timezoneObj[
																			item
																		],
																		timeIndex
																	);
																}
															)}
														</Box>
														{index <
															(
																state?.timeZoneArray ??
																[]
															).length -
																1 && (
															<Divider
																pt={0}
																pb={2}
															/>
														)}
													</Box>
												);
											}
										)}
									</Box>
								</AccordionPanel>
							</AccordionItem>
						)}
					</>
				)}
				{isSearchPlaceSectionWithinSettings(
					SearchPlaceSectionType.FavouritePlaces
				) &&
					(state?.favPlaceDisplayArray ?? []).length > 0 && (
						<AccordionItem key={4}>
							<AccordionButton
								bg={
									colorMode === "dark"
										? "gray.700"
										: "gray.100"
								}
							>
								<Box
									width={"100%"}
									fontSize={"md"}
									fontWeight={"medium"}
									textAlign="left"
								>
									{`Favourite Places - (${state?.favPlaceDisplayArray.length})`}
								</Box>
								<AccordionIcon />
							</AccordionButton>
							<AccordionPanel>
								<Box>
									{(state?.favPlaceDisplayArray ?? []).map(
										(favPlaceObj, index) => {
											return (
												<Box
													paddingY={1}
													key={`favPlace-${index}`}
												>
													<Flex
														alignItems={"center"}
														justifyContent={
															"center"
														}
														flexDirection={"row"}
													>
														<Text
															fontWeight={
																"medium"
															}
															align={"left"}
															fontSize={"md"}
														>{`${favPlaceObj?.name?.value}`}</Text>
														<Spacer />
														<Tooltip
															label="Remove place from favourite places"
															key={"fav-tt"}
														>
															<IconButton
																variant={
																	"solid"
																}
																me={2}
																onClick={() => {
																	onPressMakeUnFavItem(
																		favPlaceObj,
																		index
																	);
																}}
																icon={
																	<Icon
																		alignSelf={
																			"center"
																		}
																		as={
																			BsFillStarFill
																		}
																		boxSize={
																			"15px"
																		}
																	/>
																}
															/>
														</Tooltip>
														<Tooltip
															label="Show place in 3D Globe"
															key={"sp3dg-tt"}
														>
															<IconButton
																variant={
																	"solid"
																}
																onClick={() => {
																	onPressShowFavItem(
																		favPlaceObj,
																		index
																	);
																}}
																icon={
																	<Icon
																		alignSelf={
																			"center"
																		}
																		as={
																			MdLocationPin
																		}
																		boxSize={
																			"15px"
																		}
																	/>
																}
															/>
														</Tooltip>
													</Flex>
													<Box mt={2}>
														{Object.keys(
															favPlaceObj
														).map(
															(
																item,
																placeIndex
															) => {
																if (
																	item ===
																	"name"
																) {
																	return null;
																}

																return renderFavPlaceProperty(
																	favPlaceObj[
																		item
																	],
																	placeIndex
																);
															}
														)}
													</Box>
													{index <
														(
															state?.favPlaceDisplayArray ??
															[]
														).length -
															1 && (
														<Divider
															pt={2}
															mb={2}
														/>
													)}
												</Box>
											);
										}
									)}
								</Box>
							</AccordionPanel>
						</AccordionItem>
					)}
			</Accordion>
		);
	};

	const renderMasterContainer = () => {
		return (
			<>
				<Flex
					flex={1}
					flexDirection={"column"}
					maxHeight={"80vh"}
					overflow={"hidden"}
					borderRadius={"5px"}
					mt={2}
				>
					<Flex
						bg={"chakra-body-bg"}
						overflow={"hidden"}
						borderRadius={"5px"}
					>
						{renderPlaceInfo()}
					</Flex>
				</Flex>
			</>
		);
	};

	return renderMasterContainer();
};

const mapStateToProps = (state) => {
	return {
		userConfig: state.userConfig,
		userPref: state.userPref,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUserConfig: (userConfig) =>
			dispatch(Actions.setUserConfig(userConfig)),
		setUserPref: (userPref) => dispatch(Actions.setUserPref(userPref)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceInfoView);
