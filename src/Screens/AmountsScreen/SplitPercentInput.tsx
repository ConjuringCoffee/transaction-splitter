import React, { useCallback } from 'react';
import { TextInput } from 'react-native-paper';

type Props = {
    payerCategoryChosen: boolean,
    debtorCategoryChosen: boolean,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (splitPercent: number) => void,
}

export const SplitPercentInput = ({ setSplitPercentToPayer, ...props }: Props) => {
    const convertAndSetSplitPercentToPayer = useCallback(
        (text: string) => setSplitPercentToPayer(Number(text)),
        [setSplitPercentToPayer],
    );

    if (!props.payerCategoryChosen || !props.debtorCategoryChosen) {
        return null;
    }

    const value = String(props.splitPercentToPayer || '');

    return (
        <TextInput
            label='Split % to payer'
            keyboardType="numeric"
            value={value}
            onChangeText={convertAndSetSplitPercentToPayer}
        />
    );
};
