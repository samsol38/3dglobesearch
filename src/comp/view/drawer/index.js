import React, { Fragment, useState, useEffect, useRef } from "react";

import {
	useDisclosure,
	Box,
	Text,
	IconButton,
	Icon,
	Button,
	Input,
	Flex,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Stack,
	Divider,
} from "@chakra-ui/react";

import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

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

import { connect } from "react-redux";

import Constants from "../../utils/Constants";
import Actions from "../../redux/action";

const { MasterDrawerMenuType, MasterDrawerMenuConfig, MasterDrawerMenuArray } =
	Constants;

const DrawerView = (props) => {
	const { finalFocusRef, isOpen, onOpen, onClose, userConfig } = props;

	const [state, setState] = useState({});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	/*  Life-cycles Methods */

	useEffect(() => {
		return () => {};
	}, []);

	/*  Public Interface Methods */

	/*  UI Events Methods   */

	const onPressMenu = async (menuType) => {
		await props.setUserConfig({
			...userConfig,
			selectedMenuType: menuType,
		});

		onClose();
	};

	/*  Server Request Methods  */

	/*  Server Response Methods  */

	/*  Server Response Handler Methods  */

	/*  Custom-Component sub-render Methods */

	const renderMasterContainer = () => {
		return (
			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				finalFocusRef={finalFocusRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader
						m={0}
						p={0}
						marginX={5}
						marginTop={3}
						marginBottom={1}
					>
						<Flex
							direction={"row"}
							alignItems={"center"}
							justifyContent={"space-between"}
						>
							<Flex
								direction={"row"}
								alignItems={"center"}
							>
								<Icon
									alignSelf={"center"}
									as={FaGlobeAfrica}
									me={"13px"}
									boxSize={"32px"}
								/>
								{"Map Tools"}
							</Flex>
							<IconButton
								variant="ghost"
								icon={
									<Icon
										as={CloseIcon}
										boxSize={3}
									/>
								}
								onClick={onClose}
							/>
						</Flex>
					</DrawerHeader>
					<DrawerBody>
						<Divider
							orientation="horizontal"
							p={0}
							m={0}
							mb={"10px"}
						/>
						<Stack
							p={0}
							m={"0px"}
							direction="column"
							spacing={2}
						>
							{MasterDrawerMenuArray.map((item, index) => {
								return (
									<Button
										key={`${index}`}
										variant="ghost"
										align={"left"}
										spacing={0}
										paddingY={6}
										justifyContent={"flex-start"}
										leftIcon={React.createElement(Icon, {
											as: MasterDrawerMenuConfig[item]
												.icon,
											me: "5px",
											boxSize: "25px",
										})}
										onClick={() => {
											onPressMenu(item);
										}}
									>
										<Text
											fontWeight={"normal"}
											align={"left"}
										>
											{MasterDrawerMenuConfig[item].title}
										</Text>
									</Button>
								);
							})}
						</Stack>
					</DrawerBody>
					<Divider orientation="horizontal" />
					<DrawerFooter>{"-"}</DrawerFooter>
				</DrawerContent>
			</Drawer>
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerView);
