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
    Input,
    Flex,
    Button,
    IconButton,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    List,
    ListItem,
    ListIcon,
    Icon,
    FormControl,
    Divider,
} from "@chakra-ui/react"

import {
    HamburgerIcon,
    MoonIcon,
    SunIcon,
    CheckIcon,
    CloseIcon
} from '@chakra-ui/icons'

import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import {
    MdSettings,
    MdCheckCircle,
    MdLocationPin,
    MdSearch
} from 'react-icons/md';

import {
    connect
} from 'react-redux';

import lodash from 'lodash';

import PlaceInfoView from './placeInfo';

import Actions from '../../redux/action';
import Constants from '../../utils/Constants';

import MasterWorldArray from '../../data/info/countries+states+cities.json';

const {
    MasterDrawerMenuType,
    MasterDrawerMenuConfig,
    MasterDrawerMenuArray,
    PlaceType
} = Constants;

const SearchPlaceView = (props) => {

    const {
        userConfig,
        userPref
    } = props;

    const { colorMode } = useColorMode();

    const [state, setState] = useState({
        placeName: '',
        searchResultArray: [],
        placeItem: null
    });

    const [searchKeyword, setSearchKeyword] = useState('');

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    let searchTimer = useRef();

    /*  Life-cycles Methods */

    useEffect(() => {
        // console.log("MasterWorldArray: ", MasterWorldArray[0])
        return () => {
        };
    }, []);

    useEffect(() => {
        let selectedCountryCode = userConfig?.selectedCountryCode;
        let isPlaceVisible = userConfig?.isPlaceVisible;

        if (!lodash.isNil(selectedCountryCode)) {
            setCountryFromCountryCode(selectedCountryCode);
        }
    }, [userConfig]);

    useEffect(() => {
        // console.log("userPref1: ", userPref)
    }, [userPref]);

    useEffect(() => {
        clearSearchTimer();
        searchTimer.current = setTimeout(() => {
            searchPlaceFromKeyword(searchKeyword);
        }, 500);
    }, [searchKeyword]);

    /*  Public Interface Methods */

    const closetSort = (array, keyword) => {
        return array.sort((a, b) => {

            if (a.name.toLowerCase().indexOf(keyword.toLowerCase()) >
                b.name.toLowerCase().indexOf(keyword.toLowerCase())) {
                return 1;
            } else if (a.name.toLowerCase().indexOf(keyword.toLowerCase()) <
                b.name.toLowerCase().indexOf(keyword.toLowerCase())) {
                return -1;
            } else {
                if (a.name > b.name)
                    return 1;
                else
                    return -1;
            }
        });
    }

    const setCountryFromCountryCode = async (countryCode) => {

        let filterCountryArray = MasterWorldArray.filter((item) => {
            return item.numeric_code.toLowerCase().includes(countryCode.toLowerCase())
        }).slice(0, 1);

        if (filterCountryArray.length > 0) {
            let selectedPlaceCoordinate = userConfig?.selectedPlaceCoordinate;

            let countryItem = filterCountryArray[0];
            countryItem = lodash.omit(countryItem, ['states']);

            countryItem = {
                ...countryItem,
                ...selectedPlaceCoordinate,
                type: PlaceType.Country,
                address: `${countryItem.name}`
            };

            updateState({
                placeItem: countryItem
            });
        }

        await props.setUserConfig({
            ...userConfig,
            selectedCountryCode: null,
            selectedPlaceCoordinate: null
        });
    }

    const isSearchPlaceFromWithinSettings = (type) => {
        let appSettingObj = userPref?.appSettings ?? {};
        let searchPlaceFromArray = appSettingObj?.searchPlaceFrom ??
            [PlaceType.Country, PlaceType.State, PlaceType.City];

        return searchPlaceFromArray.includes(type);
    }

    const searchPlaceFromKeyword = (placeName) => {
        let appSettingObj = userPref.appSettings ?? {};

        let isCountrySearchEnabled = isSearchPlaceFromWithinSettings(PlaceType.Country);
        let isStateSearchEnabled = isSearchPlaceFromWithinSettings(PlaceType.State);
        let isCitySearchEnabled = isSearchPlaceFromWithinSettings(PlaceType.City);

        let filterCountryArray = [],
            filterStateArray = [],
            filterCityArray = [];

        if (lodash.isString(placeName)) {
            placeName = placeName.trim();
        }

        if (!lodash.isString(placeName) ||
            (lodash.isString(placeName) &&
                placeName.length === 0)) {
            updateState({
                searchResultArray: []
            });

            return;
        }

        const maxResultCount = 15;

        if (isCountrySearchEnabled) {
            filterCountryArray = MasterWorldArray.filter((item) => {
                return item.name.toLowerCase().includes(placeName.toLowerCase())
            }).slice(0, maxResultCount);

            filterCountryArray = filterCountryArray.map((item) => {
                return lodash.omit(item, ['states']);
            });

            // filterCountryArray = closetSort(filterCountryArray, placeName);

            filterCountryArray = filterCountryArray.map((item) => {
                return {
                    ...item,
                    type: PlaceType.Country,
                    address: `${item.name}`
                }
            });
        }

        if (isStateSearchEnabled) {
            filterStateArray = MasterWorldArray.filter((item) => {
                return (item?.states ?? [])
                    .filter((stateItem) => {
                        return stateItem.name.toLowerCase().includes(placeName.toLowerCase())
                    }).length > 0
            }).slice(0, maxResultCount);

            filterStateArray = filterStateArray.map((item) => {
                return item.states.map((stateItem) => {
                    return {
                        ...stateItem,
                        type: PlaceType.State,
                        countryItem: lodash.omit(item, ['states']),
                        countryName: item.name
                    }
                })
            }).flat();

            filterStateArray = filterStateArray.filter((item) => {
                return item.name.toLowerCase().includes(placeName.toLowerCase())
            }).slice(0, maxResultCount);

            filterStateArray = filterStateArray.map((item) => {
                return lodash.omit(item, ['cities']);
            });

            // filterStateArray = closetSort(filterStateArray, placeName);

            filterStateArray = filterStateArray.map((item) => {
                return {
                    ...item,
                    address: `${item.name}, ${item.countryName}`
                }
            });
        }

        if (isCitySearchEnabled) {
            filterCityArray = MasterWorldArray.filter((item) => {
                return (item?.states ?? [])
                    .filter((stateItem) => {
                        return (stateItem?.cities ?? [])
                            .filter((cityItem) => {
                                return cityItem.name.toLowerCase().includes(placeName.toLowerCase())
                            }).length > 0
                    }).length > 0
            }).slice(0, maxResultCount);

            filterCityArray = filterCityArray.map((item) => {
                return (item?.states ?? []).map((stateItem) => {
                    return (stateItem?.cities ?? []).map((cityItem) => {
                        return {
                            ...cityItem,
                            type: PlaceType.City,
                            countryItem: lodash.omit(item, ['states']),
                            stateItem: lodash.omit(stateItem, ['cities']),
                            stateName: stateItem?.name,
                            countryName: item.name
                        }
                    })
                })
            }).flat(3);

            filterCityArray = filterCityArray.filter((item) => {
                return item?.name?.toLowerCase().includes(placeName.toLowerCase())
            }).slice(0, maxResultCount);

            // filterCityArray = closetSort(filterCityArray, placeName);

            filterCityArray = filterCityArray.map((item) => {
                return {
                    ...item,
                    address: `${item.name}, ${item.stateName}, ${item.countryName}`
                }
            });
        }

        let searchResultArray = [
            ...filterCityArray,
            ...filterStateArray,
            ...filterCountryArray
        ].slice(0, maxResultCount);

        searchResultArray = closetSort(searchResultArray, placeName);

        updateState({
            searchResultArray: searchResultArray
        });
        // console.log("searchResultArray: ", filterCountryArray)
    }

    const clearSearchTimer = () => {
        searchTimer.current &&
            clearTimeout(searchTimer.current);

        searchTimer.current = null;
    }

    /*  UI Events Methods   */

    const handleChange = (event) => {
        let placeName = event.target.value;
        setSearchKeyword(placeName);
    }

    const onPressPlaceItem = async (placeItem) => {
        // console.log("placeItem:", placeItem);

        await props.setUserConfig({
            ...userConfig,
            selectedPlaceItem: placeItem,
            isPlaceVisible: true
        });

        setSearchKeyword('');

        updateState({
            placeItem: placeItem,
            searchResultArray: []
        });
    }

    const onSubmitEvent = (event) => {
        event.preventDefault();
    }

    const onClickClearButton = () => {
        setSearchKeyword('');
        updateState({
            searchResultArray: []
        });
    }

    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const searchBoxWidth = `25vw`

    // const renderListItem = (item, index) => {
    //     return (
    //         <ListItem
    //             key={`${index}`}
    //             bg={'chakra-body-bg'}>
    //             <Flex
    //                 _hover={{
    //                     bg: colorMode === 'dark' ?
    //                         'gray.600' : 'gray.100'
    //                 }}
    //                 _active={{
    //                     bg: colorMode === 'dark' ?
    //                         'gray.600' : 'gray.200'
    //                 }}
    //                 // borderRadius={'4px'}
    //                 paddingY={2}
    //                 paddingX={2}
    //                 flexDirection={'row'}
    //                 userSelect={'none'}
    //                 alignItems={'center'}
    //                 onClick={() => {
    //                     onPressPlaceItem(item);
    //                 }}>
    //                 <Icon
    //                     alignSelf={'flex-start'}
    //                     justifySelf={'center'}
    //                     // bg={'#00f3'}
    //                     as={MdLocationPin}
    //                     boxSize={'15px'}
    //                     me={2}
    //                     mt={1} />
    //                 <Text
    //                     //  bg={'#00f2'}
    //                     fontSize='md'
    //                 >{`${item.address}`}</Text>
    //             </Flex>
    //             <Divider />
    //         </ListItem>
    //     )
    // }

    // const renderSearchResultList = () => {
    //     const searchResultLength = (state?.searchResultArray ?? []).length;

    //     return (
    //         <>
    //             {searchResultLength > 0 &&
    //                 <Box
    //                     mt={'1px'}
    //                     borderRadius={'8px'}
    //                     borderTopRadius={0}
    //                     overflowY={'auto'}
    //                     minWidth={`${100 * 1 / 3 - 1.5}vw`}
    //                     minHeight={'40vh'}
    //                     position={'absolute'}
    //                 >
    //                     <List spacing={0}
    //                         borderWidth={1}
    //                         borderColor={'gray.200'}
    //                         position={'absolute'}
    //                         overflowY={'auto'}
    //                         overflowX={'hidden'}
    //                         bg={'chakra-body-bg'}
    //                         // width={'100%'}
    //                         // height={'100%'}
    //                         top={0}
    //                         left={0}
    //                         right={0}
    //                     // bottom={0}
    //                     >
    //                         {(state?.searchResultArray ?? []).map((item, index) => {
    //                             return renderListItem(item, index)
    //                         })}
    //                     </List>
    //                 </Box>}
    //         </>
    //     )
    // }

    const renderSearchResultList = () => {
        return (
            <Flex
                flex={1}>
                <AutoComplete
                    emptyState={<Text
                        fontSize='md'
                        align={'center'}
                    >{`No place found`}</Text>}
                >
                    <InputGroup
                        bg={'chakra-body-bg'}
                        minWidth={searchBoxWidth}
                        size='md'
                    // maxWidth={'100%'}
                    // minWidth={'100%'}
                    >
                        <InputLeftElement
                            pointerEvents='none'
                            color='gray.300'
                            fontSize='1.2em'
                            children={<Icon
                                as={MdLocationPin}
                                boxSize={'20px'} />}
                        />
                        <AutoCompleteInput
                            variant="filled"
                            placeholder='Search place name'
                            value={searchKeyword}
                            onChange={handleChange} />
                        <InputRightElement
                            children={
                                <IconButton
                                    onClick={onClickClearButton}
                                    alignSelf={'center'}
                                    variant='solid'
                                    borderStartRadius={0}
                                    icon={<Icon
                                        alignSelf={'center'}
                                        as={CloseIcon}
                                        boxSize={'15px'} />} />}
                        />
                    </InputGroup>
                    <AutoCompleteList>
                        {(state?.searchResultArray ?? []).map((item, index) => (
                            <AutoCompleteItem
                                onClick={() => {
                                    onPressPlaceItem(item);
                                }}
                                key={`option-${index}`}
                                value={item?.address}
                                fontSize='md'>
                                <Flex
                                    flexDirection={'column'}
                                    flex={1}>
                                    <Flex
                                        flexDirection={'row'}>
                                        <Icon
                                            alignSelf={'flex-start'}
                                            justifySelf={'center'}
                                            // bg={'#00f3'}
                                            as={MdLocationPin}
                                            boxSize={'15px'}
                                            me={2}
                                            mt={1} />
                                        <Text
                                            //  bg={'#00f2'}
                                            fontSize='md'
                                        >{`${item.address}`}</Text>
                                    </Flex>
                                </Flex>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete >
            </Flex>
        )
    }

    const renderMasterContainer = () => {
        const searchResultLength = (state?.searchResultArray ?? []).length;

        return (
            <>
                <Flex
                    flex={1}
                    // zIndex={10}
                    // display={'inline-flex'}
                    // position={'relative'}
                    pointerEvents={'auto'}
                    pt={3}
                    ps={3}
                    pe={3}
                    flexDirection={'column'}
                    // minWidth={searchBoxWidth}
                    bg={'#000'}
                // bg={'chakra-body-bg'}
                >
                    <Box
                        // height={'auto'}
                        // maxWidth={'25vw'}
                        // minWidth={'25vw'}

                        borderRadius={'5px'}
                        overflow={'hidden'}
                        bg={'chakra-body-bg'}
                        // bg={'transparent'}
                        // bg={'chakra-body-bg'}
                        // maxHeight={'80%'}
                        // position={'relative'}
                        zIndex={10}
                    >
                        {/* <form onSubmit={onSubmitEvent}>
                            <InputGroup
                                bg={'chakra-body-bg'}
                                minWidth={searchBoxWidth}
                                size='md'
                            // maxWidth={'100%'}
                            // minWidth={'100%'}
                            >
                                <InputLeftElement
                                    pointerEvents='none'
                                    color='gray.300'
                                    fontSize='1.2em'
                                    children={<Icon
                                        as={MdLocationPin}
                                        boxSize={'20px'} />}
                                />
                                <Input
                                    borderBottomRadius={searchResultLength > 0 ? 0 : null}
                                    placeholder={'Search place name'}
                                    // onSubmit={onSubmitEvent}
                                    value={searchKeyword}
                                    onChange={handleChange} />
                                <InputRightElement
                                    children={
                                        <IconButton
                                            onClick={onClickClearButton}
                                            alignSelf={'center'}
                                            variant='solid'
                                            borderStartRadius={0}
                                            icon={<Icon
                                                alignSelf={'center'}
                                                as={CloseIcon}
                                                boxSize={'15px'} />} />}
                                />
                            </InputGroup>
                        </form> */}
                        {renderSearchResultList()}
                    </Box>

                    <PlaceInfoView
                        isPlaceVisible={userConfig?.isPlaceVisible}
                        selectedPlaceCoordinate={userConfig?.selectedPlaceCoordinate}
                        placeItem={state?.placeItem} />
                </Flex >

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

export default connect(mapStateToProps, mapDispatchToProps)(SearchPlaceView);
