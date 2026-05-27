import React, { useMemo, useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
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
    const inputRef = useRef<TextInput>(null);

    const isValid = useMemo(
        () => !Number.isNaN(convertTextToNumber(value)),
        [value, convertTextToNumber],
    );

    return (
        <View style={{ alignItems: 'center', padding: theme.cardPadding }}>
            {/* Text sizes the container to its content so the sign an currency symbol always sits flush against the number.
                Pressable focuses the TextInput because iOS UIKit views with alpha=0 don't receive touches. */}
            <Pressable
                onPress={() => inputRef.current?.focus()}
            >
                <Text style={[{ fontSize: FONT_SIZE }, !isValid && { color: theme.colors.error }]}>
                    {`-${value || '0'}€`}
                </Text>
                <TextInput
                    ref={inputRef}
                    keyboardType='numeric'
                    value={value}
                    onChangeText={setValue}
                    style={[StyleSheet.absoluteFillObject, { opacity: 0 }]}
                />
            </Pressable>
        </View>
    );
};
