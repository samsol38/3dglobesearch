import React, {
    Fragment,
    useState,
    useEffect,
    useRef,
    createRef,
    useImperativeHandle
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Divider,
    useToast,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    RadioGroup,
    Radio,
    Stack,
    Checkbox
} from "@chakra-ui/react"

import {
    HamburgerIcon,
    MoonIcon,
    SunIcon
} from '@chakra-ui/icons'

import {
    connect
} from 'react-redux';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

const {
    CoordinateFormat
} = Constants;

const SettingSectionView = (props) => {

    const {
        title,
        children
    } = props;

    return (
        <Flex
            flexDirection={'column'}
            flex={1}
            marginBottom={1}>
            <Box bg={'blue.500'}
                width={'100%'}
                paddingY={2}
                paddingX={6}>
                <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    color={'white'}>{`${title}`}</Text>
            </Box>
            {children}
        </Flex>
    )
}

const SettingsView = React.forwardRef((props, ref) => {

    const {
        userConfig,
        userPref
    } = props;

    const [state, setState] = useState({
        searchPlaceFrom: {},
        ...userPref?.appSettings ?? {}
    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast()

    /*  Life-cycles Methods */

    useEffect(() => {
        preLoadSettings();
        return () => {
        };
    }, []);

    useEffect(() => {
        updateState({
        });
    }, [userConfig]);


    useImperativeHandle(ref, () => ({
        openModal: () => {
            onOpen();
            preLoadSettings();
        }
    }));

    /*  Public Interface Methods */

    const preLoadSettings = () => {
        let appSettingObj = userPref?.appSettings ?? {};
        updateState({
            ...appSettingObj
        });
    }

    const getUpdatedSettings = () => {
        let appSettingObj = {
            coordinateFormat: state?.coordinateFormat,
            searchPlaceFrom: state?.searchPlaceFrom
        };

        return appSettingObj;
    }

    const getDisabledCitySearch = () => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};

        return (searchPlaceFrom?.city ?? true) &&
            !((searchPlaceFrom?.state ?? true) ||
                (searchPlaceFrom?.country ?? true));
    }

    const getDisabledStateSearch = () => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};

        return (searchPlaceFrom?.state ?? true) &&
            !((searchPlaceFrom?.city ?? true) ||
                (searchPlaceFrom?.country ?? true));
    }

    const getDisabledCountrySearch = () => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};

        return (searchPlaceFrom?.country ?? true) &&
            !((searchPlaceFrom?.city ?? true) ||
                (searchPlaceFrom?.state ?? true));
    }

    /*  UI Events Methods   */

    const onChangeCoordinateFormat = (value) => {
        updateState({
            coordinateFormat: value
        });
    }

    const onChangeCitySearch = (event) => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};
        searchPlaceFrom = {
            ...searchPlaceFrom,
            city: event.target.checked
        };

        updateState({
            searchPlaceFrom: searchPlaceFrom
        });
    }

    const onChangeStateSearch = (event) => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};
        searchPlaceFrom = {
            ...searchPlaceFrom,
            state: event.target.checked
        };

        updateState({
            searchPlaceFrom: searchPlaceFrom
        });
    }

    const onChangeCountrySearch = (event) => {
        let searchPlaceFrom = state?.searchPlaceFrom ?? {};
        searchPlaceFrom = {
            ...searchPlaceFrom,
            country: event.target.checked
        };

        updateState({
            searchPlaceFrom: searchPlaceFrom
        });
    }

    const onPressSave = () => {
        onClose();

        let appSettingObj = getUpdatedSettings();

        props.setUserPref({
            ...userPref,
            appSettings: appSettingObj
        });

        toast({
            title: 'Settings saved.',
            // description: "We've created your account for you.",
            // status: 'success',
            position: 'top',
            duration: 2000,
            isClosable: false,
        })
    }

    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const renderGeneralSettings = () => {
        return (
            <SettingSectionView
                title={'General'}>
                <Flex
                    flex={1}
                    flexDirection={'column'}
                    p={5}>
                    <Text
                        fontSize={'md'}
                        fontWeight={'semibold'}
                        mb={4}
                    >{'Coordinate Format : '}</Text>
                    <RadioGroup
                        defaultValue={CoordinateFormat.DecDeg}
                        onChange={onChangeCoordinateFormat}
                        value={state?.coordinateFormat}
                        p={0}>
                        <Stack direction='column' spacing={[1, 5]}>
                            <Radio value={CoordinateFormat.DecDeg}>{'Decimal Degrees (DD)'}</Radio>
                            <Radio value={CoordinateFormat.DegMinSec}>{'Degrees, Minutes & Seconds (DMS)'}</Radio>
                            <Radio value={CoordinateFormat.DegDecMin}>{'Degrees & Decimal Minutes (DMM)'}</Radio>
                        </Stack>
                    </RadioGroup>
                </Flex>
            </SettingSectionView>
        )
    };

    const renderSearchSettings = () => {
        return (
            <SettingSectionView
                title={'Search'}>
                <Flex
                    flex={1}
                    flexDirection={'column'}
                    p={5}>
                    <Text
                        fontSize={'md'}
                        fontWeight={'semibold'}
                        mb={4}
                    >{'Search result includes : '}</Text>
                    <Stack spacing={[1, 5]} direction={['column', 'row']}>
                        <Checkbox
                            size='md'
                            disabled={getDisabledCitySearch()}
                            onChange={onChangeCitySearch}
                            isChecked={state?.searchPlaceFrom?.city ?? true}>
                            {'City'}
                        </Checkbox>
                        <Checkbox
                            size='md'
                            disabled={getDisabledStateSearch()}
                            onChange={onChangeStateSearch}
                            isChecked={state?.searchPlaceFrom?.state ?? true}>
                            {'State'}
                        </Checkbox>
                        <Checkbox
                            size='md'
                            disabled={getDisabledCountrySearch()}
                            onChange={onChangeCountrySearch}
                            isChecked={state?.searchPlaceFrom?.country ?? true}>
                            {'Country'}
                        </Checkbox>
                    </Stack>
                </Flex>
            </SettingSectionView>
        )
    };

    const renderMasterSettingSection = () => {
        return (
            <Flex
                flex={1}
                flexDirection={'column'}
                overflowX={'hidden'}
                overflowY={'auto'}>
                {renderGeneralSettings()}
                {renderSearchSettings()}
            </Flex>
        )
    }

    const renderMasterContainer = () => {
        return (
            <>
                <Modal
                    blockScrollOnMount={false}
                    isOpen={isOpen}
                    onClose={onClose}
                    size={'lg'}
                    isCentered
                    motionPreset={'slideInBottom'}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Settings</ModalHeader>
                        <ModalCloseButton />
                        <Divider />
                        <ModalBody
                            m={0}
                            p={0}>
                            {renderMasterSettingSection()}
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Flex
                                flex={1}
                                justify={'flex-end'}>
                                <Button
                                    colorScheme='blue'
                                    mr={5}
                                    onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onPressSave}>Save</Button>
                            </Flex>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }


    return renderMasterContainer()
});

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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(SettingsView);
