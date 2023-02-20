import React, { Fragment, useState, useEffect, useRef, createRef } from "react";

import {
	useDisclosure,
	useColorMode,
	Heading,
	Flex,
	IconButton,
	Icon,
	Tooltip,
} from "@chakra-ui/react";

import {
	HamburgerIcon,
	MoonIcon,
	SunIcon,
	SettingsIcon,
} from "@chakra-ui/icons";

import { FaGlobeAfrica } from "react-icons/fa";

import { BsFillInfoCircleFill } from "react-icons/bs";

import { connect } from "react-redux";

import SettingsView from "../settings";
import AboutApp from "../aboutapp";

import Actions from "../../redux/action";
import Constants from "../../utils/Constants";
import AppManager from "../../utils/AppManager";

const { MasterDrawerMenuType, MasterDrawerMenuConfig } = Constants;

const NavBarView = (props) => {
	const { userConfig } = props;

	const [state, setState] = useState({
		selectedMenuType:
			userConfig?.selectedMenuType ?? MasterDrawerMenuType.Search,
	});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	const { isOpen, onClose } = useDisclosure();
	const { colorMode, toggleColorMode } = useColorMode();

	const btnRef = useRef();
	const settingsRef = createRef();
	const aboutAppRef = createRef();

	/*  Life-cycles Methods */

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		updateState({
			selectedMenuType:
				userConfig?.selectedMenuType ?? MasterDrawerMenuType.Search,
		});
	}, [userConfig]);

	/*  Public Interface Methods */

	/*  UI Events Methods   */

	const onPressAboutApp = () => {
		aboutAppRef.current && aboutAppRef.current.openModal();
	};

	const onPressSettings = () => {
		settingsRef.current && settingsRef.current.openModal();
	};

	/*  Server Request Methods  */

	/*  Server Response Methods  */

	/*  Server Response Handler Methods  */

	/*  Custom-Component sub-render Methods */

	const renderMasterContainer = () => {
		return (
			<>
				<Flex
					flexDirection={"row"}
					justifyContent={"space-between"}
					alignItems={"center"}
					boxShadow="md"
					p={"10px"}
					zIndex={10}
				>
					<Flex
						flexDirection={"row"}
						justifyContent="flex-start"
						alignItems="center"
						paddingY={1}
					>
						<Icon
							alignSelf={"center"}
							as={FaGlobeAfrica}
							boxSize={"25px"}
						/>
						<Flex
							flexDirection={"row"}
							alignItems="center"
							justifyContent="center"
						>
							<Heading
								ms={"10px"}
								size={"md"}
							>
								{
									MasterDrawerMenuConfig[
										state?.selectedMenuType
									]?.mainTitle
								}
							</Heading>
						</Flex>
					</Flex>
					<Flex>
						<Tooltip label="Change Theme">
							<IconButton
								variant="link"
								icon={
									colorMode === "light" ? (
										<MoonIcon boxSize={"20px"} />
									) : (
										<SunIcon boxSize={"20px"} />
									)
								}
								onClick={toggleColorMode}
							/>
						</Tooltip>
						<Tooltip label="About App">
							<IconButton
								ms={3}
								variant="link"
								icon={<BsFillInfoCircleFill boxSize={"20px"} />}
								onClick={onPressAboutApp}
							/>
						</Tooltip>
						<Tooltip label="Settings">
							<IconButton
								ms={3}
								me={1}
								variant="link"
								icon={<SettingsIcon boxSize={"20px"} />}
								onClick={onPressSettings}
							/>
						</Tooltip>
					</Flex>
				</Flex>
				<SettingsView ref={settingsRef} />
				<AboutApp ref={aboutAppRef} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBarView);
