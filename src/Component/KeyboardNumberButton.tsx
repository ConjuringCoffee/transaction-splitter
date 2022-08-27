import React from 'react';
import KeyboardButton from './KeyboardButton';

interface Props {
    number: number
    onPress: (number: number) => void
}

const KeyboardNumberButton = (props: Props) => {
    return (
        <KeyboardButton
            value={String(props.number)}
            color='white'
            onPress={() => props.onPress(props.number)} />);
};

export default KeyboardNumberButton;
