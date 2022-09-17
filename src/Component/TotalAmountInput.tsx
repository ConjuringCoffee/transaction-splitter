import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { convertAmountFromText } from '../Helper/AmountHelper';
import { NumberFormatSettings } from '../Hooks/useLocalization';

interface Props {
    totalAmount: number,
    setTotalAmount: (amount: number) => void,
    numberFormatSettings: NumberFormatSettings,
}

export const TotalAmountInput = (props: Props) => {
    const [text, setText] = useState<string>('');

    const onChangeText = (text: string): void => {
        setText(text);

        const number = convertAmountFromText(text, props.numberFormatSettings);

        if (props.totalAmount !== number) {
            props.setTotalAmount(number);
        }
    };

    return (
        <TextInput
            keyboardType='numeric'
            value={text}
            onChangeText={onChangeText}
            placeholder='Total amount'
            style={styles.textInput} />
    );
};

const styles = StyleSheet.create({
    textInput: {
        fontSize: 30,
        textAlign: 'right',
    },
});
