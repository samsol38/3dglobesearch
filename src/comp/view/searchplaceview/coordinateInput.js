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
    Divider,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    Tooltip,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from "@chakra-ui/react"

import {
    HamburgerIcon,
    MoonIcon,
    SunIcon
} from '@chakra-ui/icons'


const CoordinateInputView = (props) => {

    const {
        title,
        inputFormat,
        updatedValue = 0,
        onChangeValue,
        onChangeValueEnd
    } = props;

    const [state, setState] = useState({
        value: updatedValue,
        isOnChangeStart: false
    });

    const updateState = (data) =>
        setState((preState) => ({ ...preState, ...data }));

    const [showTooltip, setShowTooltip] = React.useState(false)

    /*  Life-cycles Methods */

    useEffect(() => {
        return () => {
        };
    }, []);


    useEffect(() => {
        updateState({
            value: updatedValue
        });
    }, [updatedValue]);


    /*  Public Interface Methods */

    /*  UI Events Methods   */

    const onChangeStart = () => {
        updateState({
            isOnChangeStart: true
        });
    }

    const onMouseEnter = () => {
        if (!(state?.isOnChangeStart ?? true)) {
            setShowTooltip(true);
        }
    }
    const onMouseLeave = () => {

        if (!state?.isOnChangeStart ?? true) {
            setShowTooltip(false)
        }
    }

    const onChangeEnd = (value) => {
        setShowTooltip(false);

        updateState({
            isOnChangeStart: false
        });

        onChangeValueEnd &&
            onChangeValueEnd(value);
    }

    const onChangeSliderValue = (value) => {
        updateState({
            value: value
        });
        onChangeValue &&
            onChangeValue(value);
    }

    /*  Server Request Methods  */

    /*  Server Response Methods  */

    /*  Server Response Handler Methods  */

    /*  Custom-Component sub-render Methods */

    const renderMasterContainer = () => {

        const sliderMarkValueArray = [
            inputFormat?.min,
            inputFormat?.min + (inputFormat?.max - inputFormat?.min) * 1 / 4,
            (inputFormat?.min + inputFormat?.max) / 2,
            (inputFormat?.max - inputFormat?.min) / 4,
            inputFormat?.max
        ];

        return (
            <>
                <Flex
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    me={2}
                    mt={2}>
                    <Text
                        me={5}
                        fontSize={'sm'}
                        fontWeight={'medium'}>
                        {`${title} :`}
                    </Text>
                    <Flex
                        flex={1}
                        flexDirection={'column'}
                        alignItems={'flex-start'}
                        justifyContent={'flex-start'}>
                        <Slider
                            // aria-label='slider-ex-2'
                            focusThumbOnChange={false}
                            onChange={onChangeSliderValue}
                            onChangeStart={onChangeStart}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onChangeEnd={onChangeEnd}
                            mb={4}
                            value={state?.value}
                            {...inputFormat}
                            step={0.00001}>
                            {sliderMarkValueArray.map((item, index) => {
                                return (
                                    <SliderMark
                                        key={`${index}`}
                                        value={item}
                                        mt='2'
                                        ml='-2.5'
                                        fontSize='x-small'>
                                        {`${item}`}
                                    </SliderMark>
                                )
                            })}
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            {/* <SliderThumb /> */}
                            <Tooltip
                                isOpen={showTooltip}
                                hasArrow
                                // color='white'
                                placement='top'
                                label={`${state?.value}`}>
                                <SliderThumb bg={'blue.300'} />
                            </Tooltip>
                        </Slider>
                        <NumberInput
                            onChange={(value) => {
                                onChangeSliderValue(value);
                                onChangeValueEnd &&
                                    onChangeValueEnd(value);
                            }}
                            value={state?.value}
                            mt={5}
                            size={'sm'}
                            allowMouseWheel={true}
                            {...inputFormat}
                            step={1}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Flex>
                </Flex >
            </>
        )
    }


    return renderMasterContainer()
};

export default CoordinateInputView;
