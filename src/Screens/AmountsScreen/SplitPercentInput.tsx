import React from 'react';
import { TextInput } from 'react-native-paper';

interface Props {
    payerCategoryChosen: boolean,
    debtorCategoryChosen: boolean,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (splitPercent: number) => void,
}

export const SplitPercentInput = (props: Props) => {
    if (!props.payerCategoryChosen || !props.debtorCategoryChosen) {
        return null;
    }

    const value = String(props.splitPercentToPayer || '');

    return (
        <TextInput
            label='Split % to payer'
            keyboardType={'numeric'}
            value={value}
            onChangeText={(text) => props.setSplitPercentToPayer(Number(text))} />);
};
