import React, {
    Fragment,
    useState,
    useEffect,
    useRef
} from 'react';

import {
    useDisclosure,
    useColorMode,
    Heading,
    Box,
    Text,
    Flex,
    Button,
    IconButton,
} from "@chakra-ui/react"

import {
    HamburgerIcon,
    MoonIcon,
    SunIcon
} from '@chakra-ui/icons'

import {
    connect
} from 'react-redux';

import MasterGlobeView from '../globeview';
import MasterGlobeRectView from '../globerectview';
import SearchPlaceView from '../searchplaceview';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

const {
    MasterDrawerMenuType,
    MasterDrawerMenuConfig,
    MasterDrawerMenuArray
} = Constants;

const MasterContainer = (props) => {

    const {
        userConfig
    } = props;

    const [state, setState] = useState({

    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    /*  Life-cycles Methods */

    useEffect(() => {
        return () => {
        };
    }, []);


    /*  Public Interface Methods */

    /*  UI Events Methods   */

    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const getOperationView = () => {
        const menuType = userConfig?.selectedMenuType ?? MasterDrawerMenuType.Search;

        switch (menuType) {
            case MasterDrawerMenuType.Search: {

                return (
                    <SearchPlaceView />
                )
            }
        }
    }

    const renderMasterContainer = () => {
        return (
            <>
                <Flex
                    flex={1}>
                    <Flex
                        flex={1}>
                        {getOperationView()}
                    </Flex>
                    <Flex
                        flex={2}
                        overflow={'visible'}>
                        {/* <MasterGlobeView /> */}
                        {/* {<MasterGlobeRectView />} */}
                    </Flex>
                </Flex>
            </>
        )
    }


    return renderMasterContainer()
};

const mapStateToProps = state => {
    return {
        userConfig: state.userConfig,
        userPref: state.userPref,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUserConfig: (userConfig) => dispatch(Actions.setUserConfig(userConfig)),
        setUserPref: (userPref) => dispatch(Actions.setUserPref(userPref))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MasterContainer);
