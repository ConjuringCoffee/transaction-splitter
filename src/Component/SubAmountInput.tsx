import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { convertAmountToText, convertAmountFromText } from '../Helper/AmountHelper';
import { selectNumberFormatSettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../redux/hooks';
import { TextInput } from 'react-native-paper';

interface Props {
    amount: number,
    setAmount: (amount: number) => void,
    navigateToCalculatorScreen: () => void,
}

const ICON_CALCULATOR = 'calculator-variant';

export const SubAmountInput = ({ amount, setAmount, navigateToCalculatorScreen }: Props) => {
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const defaultValue: string = useMemo(
        () => amount ? convertAmountToText(amount, numberFormatSettings) : '',
        [amount, numberFormatSettings],
    );

    const [text, setText] = useState<string>(defaultValue);

    useEffect(() => {
        // Sync text back with changes to the amount from elsewhere
        if (amount !== convertAmountFromText(text, numberFormatSettings)) {
            setText(convertAmountToText(amount, numberFormatSettings));
        }
    }, [amount, text, numberFormatSettings]);

    const onChangeText = useCallback(
        (text: string): void => {
            text = text.trim();
            setText(text);

            const number = convertAmountFromText(text, numberFormatSettings);

            if (!isNaN(number) && amount !== number) {
                setAmount(number);
            }
        },
        [numberFormatSettings, amount, setAmount],
    );

    return (
        <TextInput
            placeholder={'€'}
            value={text}
            onChangeText={onChangeText}
            keyboardType={'numeric'}
            style={styles.textInput}
            label={'Amount'}
            right={<TextInput.Icon
                icon={ICON_CALCULATOR}
                onPress={navigateToCalculatorScreen}
            />}
        />
    );
};

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginHorizontal: 10,
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: '60%',
    },
});
