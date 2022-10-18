import React, {
    Fragment,
    useState,
    useEffect,
    useRef,
    createRef,
    forwardRef,
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

import lodash from 'lodash';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

const {
    CoordinateFormat,
    PlaceType,
    SearchPlaceSectionType
} = Constants;


const AboutApp = forwardRef((props, ref) => {

    const {
        userConfig,
        userPref
    } = props;

    const [state, setState] = useState({

    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast()

    /*  Life-cycles Methods */

    useEffect(() => {
        return () => {

        };
    }, []);

    useEffect(() => {

    }, [userConfig]);


    useEffect(() => {
        // preLoadSettings()
        // console.log("userPref: ", userPref)
    }, [userPref]);

    useImperativeHandle(ref, () => ({
        openModal: () => {
            onOpen();
        }
    }));

    /*  Public Interface Methods */


    /*  UI Events Methods   */


    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const renderMasterAboutAppSection = () => {
        return (
            <Flex>

            </Flex>
        )
    };




    const renderMasterContainer = () => {
        return (
            <>
                <Modal
                    blockScrollOnMount={false}
                    isOpen={isOpen}
                    onClose={onClose}
                    size={'lg'}
                    isCentered
                    overflow={'hidden'}
                    motionPreset={'slideInBottom'}>
                    {/* <ModalOverlay /> */}
                    <ModalOverlay
                        bg='blackAlpha.600'
                        backdropFilter='blur(10px)'
                    />
                    <ModalContent
                        overflow={'hidden'}
                    >
                        <ModalHeader>About App</ModalHeader>
                        <ModalCloseButton />
                        <Divider />
                        <ModalBody
                            m={0}
                            p={0}
                        >
                            {renderMasterAboutAppSection()}
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Flex
                                flex={1}
                                justify={'flex-end'}>
                                {/* <Button
                                    colorScheme='blue'
                                    mr={5}
                                    onClick={onClose}>
                                    Cancel
                                </Button> */}
                                <Button
                                    onClick={onClose}>OK</Button>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(AboutApp);
