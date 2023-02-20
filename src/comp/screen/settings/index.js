import React, {
	Fragment,
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";

import {
	useDisclosure,
	Box,
	Text,
	Flex,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Divider,
	useToast,
	RadioGroup,
	Radio,
	Stack,
	Checkbox,
	Switch,
	Spacer,
} from "@chakra-ui/react";

import { connect } from "react-redux";

import lodash from "lodash";

import Actions from "../../redux/action";
import Constants from "../../utils/Constants";

const { CoordinateFormat, PlaceType, SearchPlaceSectionType } = Constants;

const searchResultIncludesConfig = {
	[PlaceType.City]: {
		type: PlaceType.City,
		title: "City",
	},
	[PlaceType.State]: {
		type: PlaceType.State,
		title: "State",
	},
	[PlaceType.Country]: {
		type: PlaceType.Country,
		title: "Country",
	},
};

const searchResultIncludesArray = [
	PlaceType.City,
	PlaceType.State,
	PlaceType.Country,
];

const searchPlaceSectionConfig = {
	[SearchPlaceSectionType.InputCoordinates]: {
		type: SearchPlaceSectionType.InputCoordinates,
		title: "Input coordinates",
	},
	[SearchPlaceSectionType.PlaceDetails]: {
		type: SearchPlaceSectionType.PlaceDetails,
		title: "Place details",
	},
	[SearchPlaceSectionType.CountryDetails]: {
		type: SearchPlaceSectionType.CountryDetails,
		title: "Country details",
	},
	[SearchPlaceSectionType.TimeZoneDetails]: {
		type: SearchPlaceSectionType.TimeZoneDetails,
		title: "TimeZone details",
	},
	[SearchPlaceSectionType.FavouritePlaces]: {
		type: SearchPlaceSectionType.FavouritePlaces,
		title: "Favourite places",
	},
};

const searchPlaceSectionMasterArray = [
	SearchPlaceSectionType.InputCoordinates,
	SearchPlaceSectionType.PlaceDetails,
	SearchPlaceSectionType.CountryDetails,
	SearchPlaceSectionType.TimeZoneDetails,
	SearchPlaceSectionType.FavouritePlaces,
];

const SettingSectionView = (props) => {
	const { title, children } = props;

	return (
		<Flex
			flexDirection={"column"}
			flex={1}
			marginBottom={1}
		>
			<Box
				bg={"blue.500"}
				width={"100%"}
				paddingY={2}
				paddingX={6}
			>
				<Text
					fontSize={"md"}
					fontWeight={"semibold"}
					color={"white"}
				>{`${title}`}</Text>
			</Box>
			{children}
		</Flex>
	);
};

const SettingsView = forwardRef((props, ref) => {
	const { userConfig, userPref } = props;

	const [state, setState] = useState({
		searchPlaceFrom: [],
		searchPlaceSectionArray: [],
		searchResultIncludesArray: searchResultIncludesArray,
		searchPlaceSectionMasterArray: searchPlaceSectionMasterArray,
	});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useToast();

	/*  Life-cycles Methods */

	useEffect(() => {
		preLoadSettings();
		return () => {};
	}, []);

	useEffect(() => {}, [userConfig]);

	useImperativeHandle(ref, () => ({
		openModal: () => {
			onOpen();
			preLoadSettings();
		},
	}));

	/*  Public Interface Methods */

	const preLoadSettings = () => {
		let appSettingObj = Object.assign({}, userPref?.appSettings ?? {});
		updateState({
			coordinateFormat: (appSettingObj?.coordinateFormat ?? []).slice(),
			searchPlaceFrom: (appSettingObj?.searchPlaceFrom ?? []).slice(),
			searchPlaceSectionArray: (
				appSettingObj?.searchPlaceSectionArray ?? []
			).slice(),
			enableDayNightMode: appSettingObj?.enableDayNightMode ?? false,
		});
	};

	const getUpdatedSettings = () => {
		let appSettingObj = {
			coordinateFormat: state?.coordinateFormat.slice(),
			searchPlaceFrom: state?.searchPlaceFrom.slice(),
			searchPlaceSectionArray: state?.searchPlaceSectionArray.slice(),
			enableDayNightMode: state?.enableDayNightMode ?? false,
		};

		return appSettingObj;
	};

	const getDisabledPlaceSearchOption = (type) => {
		let searchPlaceFromArray = state?.searchPlaceFrom ?? [];
		return (
			searchPlaceFromArray.includes(type) &&
			searchPlaceFromArray.length === 1
		);
	};

	const getDisabledSearchPlaceSectionOption = (type) => {
		let searchPlaceSectionArray = state?.searchPlaceSectionArray ?? [];
		return (
			searchPlaceSectionArray.includes(type) &&
			searchPlaceSectionArray.length === 1
		);
	};

	/*  UI Events Methods   */

	const onChangeCoordinateFormat = (value) => {
		updateState({
			coordinateFormat: value,
		});
	};

	const onChangeSearchResultIncludes = (value, type) => {
		let searchPlaceFromArray = (state?.searchPlaceFrom ?? []).slice();

		if (value) {
			searchPlaceFromArray.push(type);
		} else {
			searchPlaceFromArray = lodash.remove(
				searchPlaceFromArray,
				(item) => {
					return item !== type;
				}
			);
		}

		updateState({
			searchPlaceFrom: searchPlaceFromArray,
		});
	};

	const onChangeSearchPlaceSection = (value, type) => {
		let searchPlaceSectionArray = (
			state?.searchPlaceSectionArray ?? []
		).slice();

		if (value) {
			searchPlaceSectionArray.push(type);
		} else {
			searchPlaceSectionArray = lodash.remove(
				searchPlaceSectionArray,
				(item) => {
					return item !== type;
				}
			);
		}

		updateState({
			searchPlaceSectionArray: searchPlaceSectionArray,
		});
	};

	const onPressSave = async () => {
		onClose();

		let appSettingObj = getUpdatedSettings();

		await props.setUserPref({
			...userPref,
			appSettings: {
				...(userPref?.appSettings ?? {}),
				...appSettingObj,
			},
		});

		toast({
			title: "Settings saved.",
			position: "top",
			duration: 2000,
			isClosable: false,
		});
	};

	/*  Server Request Methods  */

	/*  Server Response Methods  */

	/*  Server Response Handler Methods  */

	/*  Custom-Component sub-render Methods */

	const renderGeneralSettings = () => {
		return (
			<SettingSectionView title={"General"}>
				<Flex
					flex={1}
					flexDirection={"column"}
					p={5}
				>
					<Text
						fontSize={"md"}
						fontWeight={"semibold"}
						mb={4}
					>
						{"Coordinate format : "}
					</Text>
					<RadioGroup
						defaultValue={CoordinateFormat.DecDeg}
						onChange={onChangeCoordinateFormat}
						value={state?.coordinateFormat}
						p={0}
					>
						<Stack
							direction="column"
							spacing={[1, 5]}
						>
							<Radio value={CoordinateFormat.DecDeg}>
								{"Decimal Degrees (DD)"}
							</Radio>
							<Radio value={CoordinateFormat.DegMinSec}>
								{"Degrees, Minutes & Seconds (DMS)"}
							</Radio>
							<Radio value={CoordinateFormat.DegDecMin}>
								{"Degrees & Decimal Minutes (DMM)"}
							</Radio>
						</Stack>
					</RadioGroup>
				</Flex>
			</SettingSectionView>
		);
	};

	const renderSearchSettings = () => {
		return (
			<SettingSectionView title={"Search"}>
				<Flex
					flex={1}
					flexDirection={"column"}
					p={5}
				>
					<Text
						fontSize={"md"}
						fontWeight={"semibold"}
						mb={4}
					>
						{"Search result includes : "}
					</Text>
					<Stack
						spacing={[1, 5]}
						direction={["column", "row"]}
					>
						{state?.searchResultIncludesArray.map((item, index) => {
							let searchResultIncludesObj =
								searchResultIncludesConfig[item];
							let type = searchResultIncludesObj?.type;

							return (
								<Checkbox
									key={`searchFrom-${index}`}
									size="md"
									disabled={getDisabledPlaceSearchOption(
										type
									)}
									onChange={(event) => {
										onChangeSearchResultIncludes(
											event?.target?.checked,
											type
										);
									}}
									isChecked={state?.searchPlaceFrom?.includes(
										type
									)}
								>
									{`${searchResultIncludesObj?.title}`}
								</Checkbox>
							);
						})}
					</Stack>
					<Divider marginY={5} />
					<Text
						fontSize={"md"}
						fontWeight={"semibold"}
						mb={4}
					>
						{"Show sections : "}
					</Text>
					<Stack
						spacing={[1, 5]}
						direction={["column"]}
					>
						{state?.searchPlaceSectionMasterArray.map(
							(item, index) => {
								let searchPlaceSectionObj =
									searchPlaceSectionConfig[item];
								let type = searchPlaceSectionObj?.type;

								return (
									<Checkbox
										key={`searchSection-${index}`}
										size="md"
										disabled={getDisabledSearchPlaceSectionOption(
											type
										)}
										onChange={(event) => {
											onChangeSearchPlaceSection(
												event?.target?.checked,
												type
											);
										}}
										isChecked={state?.searchPlaceSectionArray?.includes(
											type
										)}
									>
										{`${searchPlaceSectionObj?.title}`}
									</Checkbox>
								);
							}
						)}
					</Stack>
				</Flex>
			</SettingSectionView>
		);
	};

	const renderMapSettings = () => {
		return (
			<SettingSectionView title={"3D Globe Map"}>
				<Flex
					flex={1}
					flexDirection={"row"}
					p={5}
					pb={2}
				>
					<Text
						fontSize={"md"}
						mb={4}
					>
						{"Enable Day-Night Mode"}
					</Text>
					<Spacer />
					<Switch
						isChecked={state?.enableDayNightMode ?? true}
						size="lg"
						onChange={(event) => {
							updateState({
								enableDayNightMode: event?.target?.checked,
							});
						}}
					/>
				</Flex>
			</SettingSectionView>
		);
	};

	const renderMasterSettingSection = () => {
		return (
			<Flex
				flexDirection={"column"}
				overflowX={"hidden"}
				maxHeight={"60vh"}
				overflowY={"auto"}
			>
				{renderGeneralSettings()}
				{renderMapSettings()}
				{renderSearchSettings()}
			</Flex>
		);
	};

	const renderMasterContainer = () => {
		return (
			<>
				<Modal
					blockScrollOnMount={false}
					isOpen={isOpen}
					onClose={onClose}
					size={"lg"}
					isCentered
					overflow={"hidden"}
					motionPreset={"slideInBottom"}
				>
					<ModalOverlay
						bg="blackAlpha.600"
						backdropFilter="blur(10px)"
					/>
					<ModalContent overflow={"hidden"}>
						<ModalHeader>Settings</ModalHeader>
						<ModalCloseButton />
						<Divider />
						<ModalBody
							m={0}
							p={0}
							bg={"chakra-body-bg"}
						>
							{renderMasterSettingSection()}
						</ModalBody>
						<Divider />
						<ModalFooter>
							<Flex
								flex={1}
								justify={"flex-end"}
							>
								<Button
									colorScheme="blue"
									mr={5}
									onClick={onClose}
								>
									Cancel
								</Button>
								<Button onClick={onPressSave}>Save</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	};

	return renderMasterContainer();
});

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

export default connect(mapStateToProps, mapDispatchToProps, null, {
	forwardRef: true,
})(SettingsView);
