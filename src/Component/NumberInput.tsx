import React, { useEffect, useState } from 'react';
import { Input } from '@ui-kitten/components';
import { EvaSize, RenderProp } from '@ui-kitten/components/devsupport';
import { ImageProps, StyleProp, TextProps, TextStyle } from 'react-native';
import { convertAmountFromText, convertAmountToText } from '../Helper/AmountHelper';
import { NumberFormatSettings } from '../Hooks/useLocalization';

interface Props {
    numberFormatSettings: NumberFormatSettings,
    number: number,
    setNumber: (number: number) => void,
    placeholder?: string,
    size?: EvaSize,
    textStyle?: StyleProp<TextStyle>,
    style?: StyleProp<TextStyle>,
    label?: React.ReactText | RenderProp<TextProps>,
    accessoryRight?: RenderProp<Partial<ImageProps>>,
}

const NumberInput = (props: Props) => {
    const propsNumber = props.number;
    const propsNumberFormatSettings = props.numberFormatSettings;

    const defaultValue: string = propsNumber ? convertAmountToText(propsNumber, props.numberFormatSettings) : '';
    const [numberText, setNumberText] = useState<string>(defaultValue);

    useEffect(() => {
        if (numberText === '-' && propsNumber === 0) {
            // Edge case: Do not replace with text with a zero
            return;
        } else if (propsNumber !== convertAmountFromText(numberText, propsNumberFormatSettings)) {
            setNumberText(convertAmountToText(propsNumber, propsNumberFormatSettings));
        }
    }, [propsNumber, numberText, propsNumberFormatSettings]);

    return (
        <Input
            placeholder={props.placeholder}
            value={numberText}
            onChangeText={(text) => {
                setNumberText(text);
                const number = convertAmountFromText(text, props.numberFormatSettings);
                if (number && number !== props.number) {
                    props.setNumber(number);
                }
            }}
            keyboardType={'numeric'}
            size="large"
            textStyle={props.textStyle}
            style={props.style}
            label={props.label}
            accessoryRight={props.accessoryRight} />
    );
};

export default NumberInput;
