import React, { Fragment, useState, useEffect, useRef } from "react";

import { useDisclosure } from "@chakra-ui/react";
import { connect } from "react-redux";

import AppManager from "../../utils/AppManager";
import Actions from "../../redux/action";
import Constants from "../../utils/Constants";

import SearchPlaceView from "../searchplaceview";

const { MasterDrawerMenuType, AppNotifKey } = Constants;

const MasterContainer = (props) => {
	const { userConfig } = props;

	const [state, setState] = useState({});

	const updateState = (data) =>
		setState((preState) => ({ ...preState, ...data }));

	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	/*  Life-cycles Methods */

	/*  Public Interface Methods */

	/*  UI Events Methods   */

	/*  Server Request Methods  */

	/*  Server Response Methods  */

	/*  Server Response Handler Methods  */

	/*  Custom-Component sub-render Methods */

	const renderMasterContainer = () => {
		return <SearchPlaceView menuType={MasterDrawerMenuType.Search} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(MasterContainer);
