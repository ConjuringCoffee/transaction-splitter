import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardButton } from './KeyboardButton';
import { KeyboardNumberButton } from './KeyboardNumberButton';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';

interface Props {
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

const DARK_COLOR = '#e6e5ea';

export const CalculatorKeyboard = (props: Props) => {
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    return (
        <View style={styles.mainLayout}>
            <View style={styles.numberLayout}>
                <View style={styles.numberRow}>
                    <KeyboardButton
                        value='AC'
                        color={DARK_COLOR}
                        onPress={props.onClearPress} />
                    <KeyboardButton
                        value='Del'
                        color={DARK_COLOR}
                        onPress={props.onBackPress} />
                </View>
                <View style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={7}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={8}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={9}
                        onPress={props.onDigitPress} />
                </View>
                <View style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={4}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={5}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={6}
                        onPress={props.onDigitPress} />
                </View>
                <View style={styles.numberRow}>
                    <KeyboardNumberButton
                        number={3}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={2}
                        onPress={props.onDigitPress} />
                    <KeyboardNumberButton
                        number={1}
                        onPress={props.onDigitPress} />
                </View>
                <View style={styles.numberRow}>
                    <KeyboardButton
                        value='Cancel'
                        color={DARK_COLOR}
                        onPress={props.onCancelPress} />
                    <KeyboardNumberButton
                        number={0}
                        onPress={props.onDigitPress} />
                    <KeyboardButton
                        value={numberFormatSettings.decimalSeparator}
                        color={'white'}
                        onPress={props.onDecimalSeparatorPress} />

                </View>
            </View>
            <View style={styles.operatorLayout}>
                <KeyboardButton
                    value='-'
                    color={DARK_COLOR}
                    onPress={props.onOperatorSubtractPress} />
                <KeyboardButton
                    value='+'
                    color={DARK_COLOR}
                    onPress={props.onOperatorAddPress} />
                <KeyboardButton
                    value='='
                    color={DARK_COLOR}
                    onPress={props.onCalculatePress} />
                <KeyboardButton
                    value='OK'
                    color={DARK_COLOR}
                    onPress={props.onConfirmPress} />
            </View>
        </View>
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
