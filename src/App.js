import logo from './logo.svg';
import './App.css';

import React, {
    useRef,
    useEffect,
    useState
} from 'react';

import {
    Box,
    Text,
    Flex
} from "@chakra-ui/react"

import {
    NavBarView,
    DrawerView,
    MasterContainer
} from './comp';

const App = (props) => {

    const [state, setState] = useState({
        rehydrated: false
    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    useEffect(() => {

    }, []);

    return (
        <>
            <Flex
                flex={1}
                direction={'column'}>
                <NavBarView />
                <Flex
                    flex={1}
                    direction={'row'}>
                    <MasterContainer />
                </Flex >
                {/* <Flex
                            flex={1}
                            direction={'column'}
                            align={'center'}
                            justify={'center'}
                            m={'5px'}>
                            <Text
                                bgGradient="linear(to-l, #7928CA, #FF0080)"
                                bgClip="text"
                                fontSize={'4xl'}
                                fontWeight={'extrabold'}>
                                Welcome to Chakra UI
                            </Text>
                        </Flex> */}
            </Flex >
        </>
    );
}

export default App;
