import * as React from 'react';
import { Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import KeyboardButton from './KeyboardButton';
import KeyboardNumberButton from './KeyboardNumberButton';
import { NumberFormatSettings } from '../Hooks/useLocalization';

interface Props {
    numberFormatSettings: NumberFormatSettings,
    onDigitPress: (digit: number) => void
    onDecimalSeparatorPress: () => void
    onOperatorAddPress: () => void
    onOperatorSubtractPress: () => void
    onBackPress: () => void,
    onClearPress: () => void,
    onCalculatePress: () => void,
    onConfirmPress: () => void,
    onCancelPress: () => void
}

const darkColor = '#e6e5ea';

const CalculatorKeyboard = (props: Props) => {
    return (
        <Layout style={styles.mainLayout}>
            <Layout style={styles.numberLayout}>
                <Layout style={styles.numberRow}>
                    <KeyboardButton
                        value='AC'
                        color={darkColor}
                        onPress={props.onClearPress} />
                    <KeyboardButton
                        value='Del'
                        color={darkColor}
                        onPress={props.onBackPress} />
                </Layout>
                <Layout style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={7}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={8}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={9}
                        onPress={props.onDigitPress} />
                </Layout>
                <Layout style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={4}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={5}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={6}
                        onPress={props.onDigitPress} />
                </Layout>
                <Layout style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={3}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={2}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={1}
                        onPress={props.onDigitPress} />
                </Layout>
                <Layout style={styles.numberRow}>
                    <KeyboardButton
                        value='Cancel'
                        color={darkColor}
                        onPress={props.onCancelPress} />
                    <KeyboardNumberButton
                        number={0}
                        onPress={props.onDigitPress} />
                    <KeyboardButton
                        value={props.numberFormatSettings.decimalSeparator}
                        color={'white'}
                        onPress={props.onDecimalSeparatorPress} />

                </Layout>
            </Layout>
            <Layout style={styles.operatorLayout}>
                <KeyboardButton
                    value='-'
                    color={darkColor}
                    onPress={props.onOperatorSubtractPress} />
                <KeyboardButton
                    value='+'
                    color={darkColor}
                    onPress={props.onOperatorAddPress} />
                <KeyboardButton
                    value='='
                    color={darkColor}
                    onPress={props.onCalculatePress} />
                <KeyboardButton
                    value='OK'
                    color={darkColor}
                    onPress={props.onConfirmPress} />
            </Layout>
        </Layout>
    );
};

const styles = StyleSheet.create({
    mainLayout: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopColor: 'grey',
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
    },
    numberLayout: {
        width: '82%',
    },
    operatorLayout: {
        width: '18%',
    },
    numberRow: {
        flexDirection: 'row',
    },
});

export default CalculatorKeyboard;
