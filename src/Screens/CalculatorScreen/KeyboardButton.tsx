import { Text, useTheme } from 'react-native-paper';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type Props = {
    value: string,
    variant: 'digit' | 'action',
    onPress: () => void
}

export const KeyboardButton = ({ value, variant, onPress }: Props) => {
    const theme = useTheme();
    const backgroundColor = variant === 'action' ? theme.colors.secondaryContainer : theme.colors.elevation.level1;

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? theme.colors.primaryContainer : backgroundColor,
                    borderRadius: theme.roundness * 2,
                },
                styles.pressable,
            ]}
            onPress={onPress}
        >
            <Text style={styles.text}>
                {value}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    text: {
        fontSize: 25,
    },
});
