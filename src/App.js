import "./App.css";

import React, { useEffect, useState, createRef } from "react";

import { Text, Flex, CircularProgress, useColorMode } from "@chakra-ui/react";

import MasterContainer from "./comp/screen/mastercontainer";
import Constants from "./comp/utils";
import Actions from "./comp/redux/action";

import { connect } from "react-redux";

import lodash from "lodash";
import AppManager from "./comp/utils/AppManager";

const App = (props) => {
	/*  Life-cycles Methods */

	const { isMasterAppLoading } = props;
	const { colorMode } = useColorMode();

	const [state, setState] = useState({});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	useEffect(() => {
		props.setIsMasterAppLoading(true);
	}, []);

	/*  Public Interface Methods */

	/*  Validation Methods  */

	/*  UI Events Methods   */

	/*  Custom-Component sub-render Methods */

	const renderLoader = () => {
		return (
			<Flex
				flexDirection={"row"}
				position={"absolute"}
				justifyItems={"center"}
				alignSelf={"center"}
				alignItems={"center"}
				top={"0%"}
				left={"0%"}
				width={"100vw"}
				height={"100vh"}
				backdropFilter="auto"
				backdropBlur="5px"
				backdropBrightness={"50%"}
				zIndex={150}
			>
				<Flex
					flexDirection={"row"}
					position={"absolute"}
					justifyItems={"center"}
					alignSelf={"center"}
					alignItems={"center"}
					top={"50%"}
					left={"50%"}
					boxShadow="lg"
					transform={"translate(-50%, -50%)"}
					backdropFilter="auto"
					backdropBlur="5px"
					backdropBrightness={"80%"}
					borderWidth={1}
					backgroundColor={
						colorMode === "dark" ? "gray.700" : "gray.300"
					}
					borderColor={colorMode === "dark" ? "gray.700" : "gray.400"}
					borderRadius={12}
					px={6}
					py={6}
					zIndex={100}
				>
					<CircularProgress
						isIndeterminate
						thickness={10}
						size={6}
					/>
					<Text
						ms={3}
						fontWeight={"semibold"}
						fontSize={"medium"}
					>
						{"Loading ..."}
					</Text>
				</Flex>
			</Flex>
		);
	};

	return (
		<>
			<MasterContainer />
			{isMasterAppLoading && !lodash.isNil(colorMode) && renderLoader()}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		userConfig: state.userConfig,
		isMasterAppLoading: state.isMasterAppLoading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUserConfig: (userConfig) =>
			dispatch(Actions.setUserConfig(userConfig)),
		setIsMasterAppLoading: (isMasterAppLoading) =>
			dispatch(Actions.setIsMasterAppLoading(isMasterAppLoading)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
