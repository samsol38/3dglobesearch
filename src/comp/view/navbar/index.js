import React, {
    Fragment,
    useState,
    useEffect,
    useRef,
    createRef
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
    Icon
} from "@chakra-ui/react"

import {
    HamburgerIcon,
    MoonIcon,
    SunIcon,
    SettingsIcon
} from '@chakra-ui/icons'

import {
    FaGlobeAfrica
} from "react-icons/fa";

import {
    RiTeamFill
} from "react-icons/ri";


// import {
//     FaGlobeAfrica
// } from "react-icons/bs";

import {
    connect
} from 'react-redux';

import DrawerView from '../drawer';
import SettingsView from '../settings';
import AboutApp from '../aboutapp';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

const {
    MasterDrawerMenuType,
    MasterDrawerMenuConfig,
    MasterDrawerMenuArray
} = Constants;

const NavBarView = (props) => {

    const {
        userConfig
    } = props;

    const [state, setState] = useState({
        selectedMenuType: userConfig?.selectedMenuType ?? MasterDrawerMenuType.Search,
    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    const btnRef = useRef();
    const settingsRef = createRef();
    const aboutAppRef = createRef();

    /*  Life-cycles Methods */

    useEffect(() => {
        return () => {
        };
    }, []);

    useEffect(() => {
        updateState({
            selectedMenuType: userConfig?.selectedMenuType ??
                MasterDrawerMenuType.Search
        });
    }, [userConfig]);

    /*  Public Interface Methods */

    /*  UI Events Methods   */

    const onPressAboutApp = () => {

        // console.log(settingsRef.current)
        aboutAppRef.current &&
            aboutAppRef.current.openModal();
    }

    const onPressSettings = () => {

        // console.log(settingsRef.current)
        settingsRef.current &&
            settingsRef.current.openModal();
    }

    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const renderMasterContainer = () => {
        return (
            <>
                <Flex
                    flexDirection={'row'}
                    justifyContent={"space-between"}
                    alignItems={'center'}
                    boxShadow='md'
                    p={'10px'}
                    zIndex={10}>
                    <Flex
                        flexDirection={'row'}
                        justifyContent="flex-start"
                        alignItems="center"
                        paddingY={1}>
                        {/* <IconButton
                            ref={btnRef}
                            variant='unstyled'
                            icon={<HamburgerIcon
                                boxSize={'20px'} />}
                            onClick={onOpen} /> */}
                        {/* <IconButton
                            variant='unstyled'
                            icon={<Icon
                                alignSelf={'center'}
                                as={FaGlobeAfrica}
                                boxSize={'32px'} />}
                        /> */}
                        <Icon
                            alignSelf={'center'}
                            as={FaGlobeAfrica}
                            boxSize={'25px'}
                        />
                        <Flex
                            flexDirection={'row'}
                            alignItems="center"
                            justifyContent="center">
                            <Heading
                                ms={'10px'}
                                size={'md'}>
                                {MasterDrawerMenuConfig[state?.selectedMenuType]?.mainTitle}
                            </Heading>
                        </Flex>
                    </Flex>
                    <Flex>
                        <IconButton
                            variant='link'
                            icon={colorMode === 'light' ?
                                <MoonIcon
                                    boxSize={'20px'} /> :
                                <SunIcon
                                    boxSize={'20px'} />}
                            onClick={toggleColorMode} />
                        {/* <IconButton
                            ms={3}
                            variant='link'
                            icon={<SettingsIcon
                                boxSize={'20px'} />}
                        /> */}
                        <IconButton
                            ms={3}
                            variant='link'
                            icon={<RiTeamFill
                                boxSize={'20px'} />}
                            onClick={onPressAboutApp} />
                        <IconButton
                            ms={3}
                            me={1}
                            variant='link'
                            icon={<SettingsIcon
                                boxSize={'20px'} />}
                            onClick={onPressSettings} />
                    </Flex>
                </Flex>
                <DrawerView
                    finalFocusRef={btnRef}
                    isOpen={isOpen}
                    onClose={onClose} />
                <SettingsView
                    ref={settingsRef}
                />
                <AboutApp
                    ref={aboutAppRef}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBarView);
