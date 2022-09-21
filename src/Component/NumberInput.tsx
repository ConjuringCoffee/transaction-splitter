import React, { useEffect, useState } from 'react';
import { Input } from '@ui-kitten/components';
import { EvaSize, RenderProp } from '@ui-kitten/components/devsupport';
import { ImageProps, StyleProp, TextStyle } from 'react-native';
import { convertAmountFromText, convertAmountToText } from '../Helper/AmountHelper';
import { useAppSelector } from '../redux/hooks';
import { selectNumberFormatSettings } from '../redux/features/displaySettings/displaySettingsSlice';

interface Props {
    number: number,
    setNumber: (number: number) => void,
    placeholder?: string,
    size?: EvaSize,
    textStyle?: StyleProp<TextStyle>,
    style?: StyleProp<TextStyle>,
    label?: string,
    accessoryRight?: RenderProp<Partial<ImageProps>>,
}

// TODO: Harmonize with TotalAmountInput
export const NumberInput = (props: Props) => {
    const propsNumber = props.number;
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const defaultValue: string = propsNumber ? convertAmountToText(propsNumber, numberFormatSettings) : '';
    const [numberText, setNumberText] = useState<string>(defaultValue);

    useEffect(() => {
        if (numberText === '-' && propsNumber === 0) {
            // Edge case: Do not replace with text with a zero
            return;
        } else if (propsNumber !== convertAmountFromText(numberText, numberFormatSettings)) {
            setNumberText(convertAmountToText(propsNumber, numberFormatSettings));
        }
    }, [propsNumber, numberText, numberFormatSettings]);

    return (
        <Input
            placeholder={props.placeholder}
            value={numberText}
            onChangeText={(text) => {
                setNumberText(text);
                const number = convertAmountFromText(text, numberFormatSettings);
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
