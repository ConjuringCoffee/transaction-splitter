import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { TextInput } from 'react-native';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useTheme } from '../../Hooks/useTheme';

const FONT_SIZE = 40;

type Props = {
    value: string,
    setValue: (newValue: string) => void,
}

export const TotalAmountInput = ({ value, setValue }: Props) => {
    const [convertTextToNumber] = useAmountConversion();
    const [theme] = useTheme();

    const isValid = useMemo(
        () => !isNaN(convertTextToNumber(value)),
        [value, convertTextToNumber],
    );

    return (
        <View style={{ alignItems: 'center', padding: theme.cardPadding }}>
            {/* Text sizes the container to its content so the € always sits flush against the number.
                The invisible TextInput fills the same bounds to capture keyboard input. */}
            <View>
                <Text style={[{ fontSize: FONT_SIZE }, !isValid && { color: theme.colors.error }]}>
                    {`-${value || '0'}€`}
                </Text>
                <TextInput
                    keyboardType='numeric'
                    value={value}
                    onChangeText={setValue}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
                />
            </View>
        </View>
    );
};
