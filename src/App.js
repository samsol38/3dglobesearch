import logo from './logo.svg';
import './App.css';

import React, {
    useRef
} from 'react';

import {
    Box,
    Text,
    Flex
} from "@chakra-ui/react"

import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';
import { persistor, store } from './comp/redux/store';

import {
    NavBarView,
    DrawerView,
    MasterContainer
} from './comp';

const App = () => {

    const menuRef = useRef();

    return (
        <>
            <Provider store={store}>
                <PersistGate
                    loading={null}
                    persistor={persistor}>
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
                </PersistGate>
            </Provider>
        </>
    );
}

export default App;
