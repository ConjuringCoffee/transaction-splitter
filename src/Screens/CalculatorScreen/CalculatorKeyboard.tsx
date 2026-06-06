import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardButton } from './KeyboardButton';
import { KeyboardNumberButton } from './KeyboardNumberButton';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { useTheme } from '../../Hooks/useTheme';

type Props = {
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

export const CalculatorKeyboard = (props: Props) => {
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);
    const [theme] = useTheme();
    const buttonGap = theme.spacing / 2;

    return (
        <View
            style={[styles.mainLayout, {
                borderTopColor: theme.colors.outlineVariant,
                backgroundColor: theme.colors.elevation.level1,
                borderTopLeftRadius: theme.roundness * 3,
                borderTopRightRadius: theme.roundness * 3,
                padding: theme.spacing,
                gap: theme.spacing,
            }]}
        >
            <View style={[styles.numberLayout, { gap: buttonGap }]}>
                <View style={[styles.numberRow, { gap: buttonGap }]}>
                    <KeyboardButton
                        value='AC'
                        variant='action'
                        onPress={props.onClearPress}
                    />
                    <KeyboardButton
                        value='Del'
                        variant='action'
                        onPress={props.onBackPress}
                    />
                </View>
                <View style={[styles.numberRow, { gap: buttonGap }]}>
                    <KeyboardNumberButton number={7} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={8} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={9} onPress={props.onDigitPress} />
                </View>
                <View style={[styles.numberRow, { gap: buttonGap }]}>
                    <KeyboardNumberButton number={4} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={5} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={6} onPress={props.onDigitPress} />
                </View>
                <View style={[styles.numberRow, { gap: buttonGap }]}>
                    <KeyboardNumberButton number={3} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={2} onPress={props.onDigitPress} />
                    <KeyboardNumberButton number={1} onPress={props.onDigitPress} />
                </View>
                <View style={[styles.numberRow, { gap: buttonGap }]}>
                    <KeyboardButton
                        value='Cancel'
                        variant='action'
                        onPress={props.onCancelPress}
                    />
                    <KeyboardNumberButton number={0} onPress={props.onDigitPress} />
                    <KeyboardButton
                        value={numberFormatSettings.decimalSeparator}
                        variant='digit'
                        onPress={props.onDecimalSeparatorPress}
                    />
                </View>
            </View>
            <View style={[styles.operatorLayout, { gap: buttonGap }]}>
                <KeyboardButton value='−' variant='action' onPress={props.onOperatorSubtractPress} />
                <KeyboardButton value='+' variant='action' onPress={props.onOperatorAddPress} />
                <KeyboardButton value='=' variant='action' onPress={props.onCalculatePress} />
                <KeyboardButton value='OK' variant='action' onPress={props.onConfirmPress} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainLayout: {
        flexDirection: 'row',
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    numberLayout: {
        flex: 5,
    },
    operatorLayout: {
        flex: 1,
    },
    numberRow: {
        flexDirection: 'row',
    },
});
