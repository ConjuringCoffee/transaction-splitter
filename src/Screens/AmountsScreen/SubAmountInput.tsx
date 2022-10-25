import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { useAmountConversion } from '../../Hooks/useAmountConversion';

interface Props<T extends keyof StackParameterList> {
    value: string,
    setValue: (newValue: string) => void,
    navigation: MyStackNavigationProp<T>,
}

const ICON_CALCULATOR = 'calculator-variant';

export const SubAmountInput = <T extends keyof StackParameterList>({ value, setValue, navigation }: Props<T>) => {
    const [convertTextToNumber, convertNumberToText] = useAmountConversion();

    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    const isValid = useMemo(
        () => {
            const number = convertTextToNumber(value);
            return !isNaN(number);
        },
        [value, convertTextToNumber],
    );

    const navigateToCalculatorScreen = useCallback(
        () => {
            const number = convertTextToNumber(value);
            const currentAmount = !isNaN(number) ? number : 0;

            navigation.navigate(
                ScreenNames.CALCULATOR_SCREEN,
                {
                    currentAmount: currentAmount,
                    setAmount: (newAmount) => setValue(convertNumberToText(newAmount)),
                    previousCalculations: previousCalculations,
                    setPreviousCalculations: setPreviousCalculations,
                },
            );
        },
        [convertTextToNumber, convertNumberToText, value, setValue, previousCalculations, setPreviousCalculations, navigation],
    );

    return (
        <TextInput
            placeholder={'€'}
            value={value}
            error={!isValid}
            onChangeText={setValue}
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
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: '60%',
    },
});
