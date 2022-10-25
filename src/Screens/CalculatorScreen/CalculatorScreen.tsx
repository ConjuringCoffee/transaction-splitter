import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { CalculatorKeyboard } from '../../Component/CalculatorKeyboard';
import { StyleSheet, View } from 'react-native';
import { Calculation } from '../../Helper/Calculation';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppSelector } from '../../redux/hooks';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { Appbar, Text } from 'react-native-paper';
import { useAmountConversion } from '../../Hooks/useAmountConversion';

type ScreenName = 'Calculator';

type Props = {
    navigation: StackNavigationProp<StackParameterList, ScreenName>;
    route: RouteProp<StackParameterList, ScreenName>;
}

const SCREEN_TITLE = 'Calculate the amount';
const ICON_HISTORY = 'history';

export const CalculatorScreen = ({ route, navigation }: Props) => {
    const [, convertNumberToText] = useAmountConversion();
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const routePreviousCalculations = route.params.previousCalculations;
    const routeSetPreviousCalculations = route.params.setPreviousCalculations;

    const { currentAmount } = route.params;

    const defaultCalculation: string = useMemo(
        () => {
            if (routePreviousCalculations.length === 0) {
                return convertNumberToText(currentAmount);
            }

            const lastCalculation = routePreviousCalculations[routePreviousCalculations.length - 1];
            const lastResult = new Calculation(lastCalculation, numberFormatSettings).getResult();

            if (lastResult === currentAmount) {
                return lastCalculation;
            }

            return '';
        },
        [currentAmount, numberFormatSettings, routePreviousCalculations, convertNumberToText],
    );

    const [currentCalculation, setCurrentCalculation] = useState<string>(defaultCalculation);

    // TODO: Do not duplicate the state from the previous screen
    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    const { setAmount } = route.params;

    useEffect(() => {
        setPreviousCalculations(routePreviousCalculations);
    }, [routePreviousCalculations]);

    useEffect(() => {
        routeSetPreviousCalculations(previousCalculations);
    }, [previousCalculations, routeSetPreviousCalculations]);

    const addPreviousCalculation = useCallback((calculation: string) => {
        const calculations = [...previousCalculations, calculation];
        setPreviousCalculations(calculations);
    }, [previousCalculations]);

    const navigateToHistoryScreen = useCallback(
        () => {
            navigation.navigate(
                ScreenNames.CALCULATION_HISTORY_SCREEN,
                {
                    previousCalculations: previousCalculations,
                    onSelectCalculation: (selectedCalculation) => {
                        if (previousCalculations.length > 0
                            && previousCalculations[previousCalculations.length - 1] !== currentCalculation) {
                            addPreviousCalculation(currentCalculation);
                        }
                        setCurrentCalculation(selectedCalculation);
                    },
                },
            );
        },
        [navigation, previousCalculations, addPreviousCalculation, setCurrentCalculation, currentCalculation],
    );

    const navigationBar = useCallback(() => (
        <NavigationBar
            title={SCREEN_TITLE}
            navigation={navigation}
            additions={
                <Appbar.Action
                    onPress={navigateToHistoryScreen}
                    icon={ICON_HISTORY} />
            }
        />
    ), [navigation, navigateToHistoryScreen]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: navigationBar,
        });
    }, [navigation, navigationBar]);

    const onDigitPress = (digit: number): void => {
        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addDigit(digit);
        setCurrentCalculation(newCalculation.getCalculationString());
    };

    const onDecimalSeparatorPress = (): void => {
        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addDecimalSeparator();
        setCurrentCalculation(newCalculation.getCalculationString());
    };

    const onOperatorAddPress = (): void => {
        addOperatorToCurrentCalculation('+');
    };

    const addOperatorToCurrentCalculation = (operator: string): void => {
        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addOperator(operator);
        setCurrentCalculation(newCalculation.getCalculationString());
    };

    const onOperatorSubtractPress = (): void => {
        addOperatorToCurrentCalculation('-');
    };

    const onBackPress = (): void => {
        setCurrentCalculation(currentCalculation.slice(0, -1));
    };

    const onClearPress = (): void => {
        setCurrentCalculation('');
    };

    const onCalculatePress = (): void => {
        const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();
        setCurrentCalculation(convertNumberToText(currentResult));
        addPreviousCalculation(currentCalculation);
    };

    const onConfirmPress = (): void => {
        const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();

        setAmount(currentResult);
        addPreviousCalculation(currentCalculation);
        navigation.goBack();
    };

    const onCancelPress = (): void => {
        navigation.goBack();
    };

    const resultText: string = useMemo(
        () => {
            const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();
            return convertNumberToText(currentResult);
        },
        [currentCalculation, numberFormatSettings, convertNumberToText],
    );

    return (
        <>
            <View>
                <Text style={[styles.text, styles.calculation]}>
                    {currentCalculation}
                </Text>
                <Text style={[styles.text, styles.result]}>
                    {resultText}
                </Text>
            </View>
            <CalculatorKeyboard
                onDigitPress={onDigitPress}
                onDecimalSeparatorPress={onDecimalSeparatorPress}
                onOperatorAddPress={onOperatorAddPress}
                onOperatorSubtractPress={onOperatorSubtractPress}
                onBackPress={onBackPress}
                onClearPress={onClearPress}
                onCalculatePress={onCalculatePress}
                onConfirmPress={onConfirmPress}
                onCancelPress={onCancelPress} />
        </>
    );
};

const styles = StyleSheet.create({
    calculation: {
        fontSize: 40,
    },
    result: {
        fontSize: 30,
    },
    text: {
        textAlign: 'right',
        margin: 10,
    },
    historyButton: {
        marginRight: 10,
    },
});
