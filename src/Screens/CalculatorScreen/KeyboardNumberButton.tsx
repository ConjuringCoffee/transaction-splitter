import React, { useCallback } from 'react';
import { KeyboardButton } from './KeyboardButton';

type Props = {
    number: number
    onPress: (number: number) => void
}

export const KeyboardNumberButton = ({ number, onPress }: Props) => {
    const onPressNumber = useCallback(
        () => onPress(number),
        [onPress, number],
    );

    return (
        <KeyboardButton
            value={String(number)}
            color='white'
            onPress={onPressNumber}
        />
    );
};
