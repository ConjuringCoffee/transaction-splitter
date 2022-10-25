import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAmountConversion } from '../Hooks/useAmountConversion';

interface Props {
    value: string,
    setValue: (newValue: string) => void,
}

export const TotalAmountInput = ({ value, setValue }: Props) => {
    const [convertTextToNumber] = useAmountConversion();

    const isValid = useMemo(
        () => {
            const number = convertTextToNumber(value);
            return !isNaN(number);
        },
        [value, convertTextToNumber],
    );

    return (
        <TextInput
            keyboardType='numeric'
            value={value}
            error={!isValid}
            onChangeText={setValue}
            label='Total amount'
            style={styles.textInput}
            right={<TextInput.Affix text="€" />}
        />
    );
};

const styles = StyleSheet.create({
    textInput: {
        fontSize: 30,
    },
});
