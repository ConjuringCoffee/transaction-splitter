import { Text } from '@ui-kitten/components';
import React from 'react';
import { ColorValue, Pressable, StyleSheet } from 'react-native';

interface Props {
    value: string,
    color: ColorValue,
    onPress: () => void
}

export const KeyboardButton = (props: Props) => {
    const styles = StyleSheet.create({
        pressable: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 60,
        },
    });

    return (
        <Pressable
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? '#d2d1d6' : props.color,
                },
                styles.pressable]}
            onPress={() => {
                props.onPress();
            }}>
            <Text category={'h4'}>
                {props.value}
            </Text>
        </Pressable>
    );
};

