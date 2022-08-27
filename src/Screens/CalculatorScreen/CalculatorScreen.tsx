import React, { useEffect, useState } from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import CalculatorKeyboard from '../../Component/CalculatorKeyboard';
import { ImageProps, StyleSheet } from 'react-native';
import { Calculation } from '../../Helper/Calculation';
import { convertAmountToText } from '../../Helper/AmountHelper';
import { nameCalculationHistoryScreen } from '../../Helper/Navigation/ScreenNames';
import useLocalization from '../../Hooks/useLocalization';
import LoadingComponent from '../../Component/LoadingComponent';

type ScreenName = 'Calculator';

type Props = {
    navigation: StackNavigationProp<StackParameterList, ScreenName>;
    route: RouteProp<StackParameterList, ScreenName>;
}

const HistoryIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='clock-outline' />
);

const CalculatorScreen = ({ route, navigation }: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [currentCalculation, setCurrentCalculation] = useState<string>('');

    // Not cool to duplicate the state from the previous screen, but I don't know how else to do it
    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    const { currentAmount } = route.params;
    const { setAmount } = route.params;

    useEffect(() => {
        if (!numberFormatSettings) {
            return;
        } else if (previousCalculations.length === 0) {
            setCurrentCalculation(convertAmountToText(currentAmount, numberFormatSettings));
            return;
        }

        const lastCalculation = previousCalculations[previousCalculations.length - 1];
        const lastResult = new Calculation(lastCalculation, numberFormatSettings).getResult();

        if (lastResult === currentAmount) {
            setCurrentCalculation(lastCalculation);
        } else {
            setCurrentCalculation(convertAmountToText(currentAmount, numberFormatSettings));
        }
    }, [numberFormatSettings]);

    useEffect(() => {
        setPreviousCalculations(route.params.previousCalculations);
    }, []);

    useEffect(() => {
        route.params.setPreviousCalculations(previousCalculations);
    }, [previousCalculations]);

    React.useLayoutEffect(() => {
        // TODO: Solve dependency issue to addPreviousCalculation
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate(
                            nameCalculationHistoryScreen,
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
                    }}
                    accessoryLeft={HistoryIcon}
                    style={styles.historyButton}
                    appearance='outline' />
            ),
        });
    }, [navigation, previousCalculations, currentCalculation]);

    const addPreviousCalculation = (calculation: string) => {
        const calculations = [...previousCalculations, calculation];
        setPreviousCalculations(calculations);
    };

    const onDigitPress = (digit: number): void => {
        if (!numberFormatSettings) {
            throw new Error('Should be impossible to get here');
        }

        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addDigit(digit);
        setCurrentCalculation(newCalculation.getCalculationString());
    };
    const onDecimalSeparatorPress = (): void => {
        if (!numberFormatSettings) {
            throw new Error('Should be impossible to get here');
        }

        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addDecimalSeparator();
        setCurrentCalculation(newCalculation.getCalculationString());
    };
    const onOperatorAddPress = (): void => {
        addOperatorToCurrentCalculation('+');
    };

    const addOperatorToCurrentCalculation = (operator: string): void => {
        if (!numberFormatSettings) {
            throw new Error('Should be impossible to get here');
        }

        const newCalculation = new Calculation(currentCalculation, numberFormatSettings);
        newCalculation.addOperator(operator);
        setCurrentCalculation(newCalculation.getCalculationString());
    }

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
        if (!numberFormatSettings) {
            throw new Error('Should be impossible to get here');
        }

        const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();

        setCurrentCalculation(convertAmountToText(currentResult, numberFormatSettings));
        addPreviousCalculation(currentCalculation);
    };

    const onConfirmPress = (): void => {
        if (!numberFormatSettings) {
            throw new Error('Should be impossible to get here');
        }

        const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();

        setAmount(currentResult);
        addPreviousCalculation(currentCalculation);
        navigation.goBack();
    };

    const onCancelPress = (): void => {
        navigation.goBack();
    };

    let resultText = '';

    if (numberFormatSettings) {
        const currentResult = new Calculation(currentCalculation, numberFormatSettings).getResult();
        resultText = convertAmountToText(currentResult, numberFormatSettings);
    }

    return (
        <>
            {numberFormatSettings
                ? <>
                    <Layout>
                        <Text category='h1' style={styles.text}>
                            {currentCalculation}
                        </Text>
                        <Text category='h4' style={styles.text}>
                            {resultText}
                        </Text>
                    </Layout>
                    <CalculatorKeyboard
                        numberFormatSettings={numberFormatSettings}
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
                : <LoadingComponent />}
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: 'right',
        margin: 10,
    },
    historyButton: {
        marginRight: 10,
    },
});

export default CalculatorScreen;
