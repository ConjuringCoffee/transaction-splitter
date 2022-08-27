import { Input } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface Props {
    payerCategoryChosen: boolean,
    debtorCategoryChosen: boolean,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (splitPercent: number) => void,
}

const SplitPercentInput = (props: Props) => {
    if (!props.payerCategoryChosen || !props.debtorCategoryChosen) {
        return null;
    }

    const value = String(props.splitPercentToPayer || '');

    return (
        <Input
            style={styles.split}
            label='Split % to payer'
            keyboardType={'numeric'}
            value={value}
            onChangeText={(text) => props.setSplitPercentToPayer(Number(text))} />);
};

const styles = StyleSheet.create({
    split: {
        flex: 1,
        margin: 5,
        width: '30%',
    },
});

export default SplitPercentInput;
