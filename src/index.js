import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, connect } from 'react-redux';
import { persistor, store } from './comp/redux/store';

import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>

        <Provider store={store}>
            <PersistGate
                // loading={null}
                loading={<div>Loading...</div>}
                persistor={persistor}>
                <ChakraProvider theme={theme}>
                    <App />
                </ChakraProvider>
            </PersistGate>
        </Provider>
    </>
);

// <React.StrictMode>
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
