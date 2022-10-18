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
    Checkbox,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Link,
    TableContainer,
    Spacer,
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

const AboutAppSectionView = (props) => {

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

    const libKeyTitleObj = {
        title: 'Title',
        version: 'Version',
        package: 'Package',
        npmURL: 'Package URL',
        url: 'URL'
    };

    const libMasterObj = {
        react: {
            title: 'React',
            version: '18.2.0',
            package: 'react',
            npmURL: 'https://www.npmjs.com/package/react',
            url: 'https://github.com/facebook/react'
        },
        reactDom: {
            title: 'React Dom',
            version: '18.2.0',
            package: 'react-dom',
            npmURL: 'https://www.npmjs.com/package/react-dom',
            url: 'https://reactjs.org/'
        },
        chakraReact: {
            title: 'Chakra React',
            version: '2.2.8',
            package: '@chakra-ui/react',
            npmURL: 'https://www.npmjs.com/package/@chakra-ui/react',
            url: 'https://chakra-ui.com/'
        },
        chakraIcons: {
            title: 'Chakra Icons',
            version: '2.0.8',
            package: '@chakra-ui/icons',
            npmURL: 'https://www.npmjs.com/package/@chakra-ui/icons',
            url: 'https://github.com/chakra-ui/chakra-ui#readme'
        },
        chakraAutoComplete: {
            title: 'Chakra AutoComplete Control',
            version: '5.1.1',
            package: '@choc-ui/chakra-autocomplete',
            npmURL: 'https://www.npmjs.com/package/@choc-ui/chakra-autocomplete',
            url: 'https://github.com/chakra-ui/chakra-ui#readme'
        },
        d3js: {
            title: 'D3 - Data-Driven Documents',
            version: '7.6.1',
            package: 'd3',
            npmURL: 'https://www.npmjs.com/package/d3',
            url: 'https://d3js.org/'
        },
        topoJSON: {
            title: 'TopoJSON Client',
            version: '3.1.0',
            package: 'topojson-client',
            npmURL: 'https://www.npmjs.com/package/topojson-client',
            url: 'https://github.com/topojson/topojson-client'
        },
        versor: {
            title: 'Versor',
            version: '0.2.0',
            package: 'versor',
            npmURL: 'https://www.npmjs.com/package/versor',
            url: 'https://github.com/Fil/versor'
        },
        geolib: {
            title: 'Geolib',
            version: '3.3.3',
            package: 'geolib',
            npmURL: 'https://www.npmjs.com/package/geolib',
            url: 'https://github.com/manuelbieh/geolib#readme'
        },
        lodash: {
            title: 'lodash',
            version: '4.17.21',
            package: 'lodash',
            npmURL: 'https://www.npmjs.com/package/lodash',
            url: 'https://github.com/chakra-ui/chakra-ui#readme'
        },
        reactIcons: {
            title: 'React Icons',
            version: '4.4.0',
            package: 'react-icons',
            npmURL: 'https://www.npmjs.com/package/react-icons',
            url: 'https://github.com/react-icons/react-icons#readme'
        },
        reactLiveClock: {
            title: 'React Live Clock',
            version: '6.0.6',
            package: 'react-live-clock',
            npmURL: 'https://www.npmjs.com/package/react-live-clock',
            url: 'https://github.com/pvoznyuk/react-live-clock'
        },
        reactMoment: {
            title: 'React Moment',
            version: '1.1.2',
            package: 'react-moment',
            npmURL: 'https://www.npmjs.com/package/react-moment',
            url: 'https://github.com/headzoo/react-moment#readme'
        },
        redux: {
            title: 'Redux',
            version: '4.2.0',
            package: 'redux',
            npmURL: 'https://www.npmjs.com/package/redux',
            url: 'http://redux.js.org/'
        },
        reduxPersist: {
            title: 'Redux Persist',
            version: '6.0.0',
            package: 'redux-persist',
            npmURL: 'https://www.npmjs.com/package/redux-persist',
            url: 'https://github.com/rt2zz/redux-persist#readme'
        },
        timezoneLookup: {
            title: 'Timezone Lookup',
            version: '6.1.25',
            package: 'tz-lookup',
            npmURL: 'https://www.npmjs.com/package/tz-lookup',
            url: 'https://github.com/klinquist/tz-lookup'
        }
    }

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

    const renderAboutDeveloperSection = () => {
        return (
            <AboutAppSectionView
                title={'About Developer'}>
                <Flex
                    flex={1}
                    flexDirection={'column'}
                    p={5}>
                    <Text
                        fontSize={'md'}
                        fontWeight={'semibold'}
                        mb={4}
                    >{''}</Text>

                </Flex>
            </AboutAppSectionView>
        )
    };

    const renderAboutLibrarySection = () => {
        return (
            <AboutAppSectionView
                title={'Libraries'}>
                <Flex
                    flex={1}
                    flexDirection={'column'}
                    p={5}>
                    <TableContainer>
                        <Table size='sm'>
                            <Thead>
                                <Tr>
                                    <Th>Library</Th>
                                    <Th>Details</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Object.keys(libMasterObj).map((libKey, index) => {
                                    let libObj = libMasterObj[libKey];
                                    return (
                                        <Tr
                                            key={`libDesc-${index}`}>
                                            <Td>
                                                <Text alignSelf={'center'} fontSize={'md'}>{`${libObj?.title}`}</Text>
                                            </Td>
                                            <Td>
                                                <Stack
                                                    spacing={[1, 5]}
                                                    direction={['column']}
                                                    justifyContent={'center'}>
                                                    <Link key={'libitem-1'}
                                                        href={libObj?.npmURL}
                                                        passHref
                                                        target="_blank">
                                                        <Button as="a"
                                                            variant={'link'}>
                                                            <Text
                                                                as={'u'}
                                                                fontSize={'md'}>
                                                                {`${libObj?.package}@${libObj?.version}`}
                                                            </Text>
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        pb={2}
                                                        key={'libitem-2'}
                                                        href={libObj?.url}
                                                        passHref
                                                        target="_blank">
                                                        <Button as="a"
                                                            variant={'link'}>
                                                            <Text
                                                                as={'u'}
                                                                fontSize={'md'}>{`${libObj?.url}`}</Text>
                                                        </Button>
                                                    </Link>
                                                    <Divider />
                                                </Stack>
                                            </Td>
                                        </Tr>

                                    )
                                })}
                                <Tr>
                                    <Td>
                                        <Text verticalAlign={'center'} fontSize={'md'}>{`Countries States Cities Database`}</Text>
                                    </Td>
                                    <Td>
                                        <Stack
                                            spacing={[1, 5]}
                                            direction={['column']}
                                            justifyContent={'center'}>
                                            <Link
                                                pb={2}
                                                href={'https://github.com/dr5hn/countries-states-cities-database'}
                                                passHref
                                                target="_blank">
                                                <Button as="a"
                                                    variant={'link'}>
                                                    <Text
                                                        as={'u'}
                                                        fontSize={'md'}>{`https://github.com/dr5hn/countries-states-cities-database`}</Text>
                                                </Button>
                                            </Link>
                                            <Divider />
                                        </Stack>
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </AboutAppSectionView>
        )
    };

    const renderMasterAboutAppSection = () => {
        return (
            <Flex
                flexDirection={'column'}
                overflowX={'hidden'}
                maxHeight={'60vh'}
                overflowY={'auto'}>
                {renderAboutDeveloperSection()}
                {renderAboutLibrarySection()}
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
                    size={'4xl'}
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
