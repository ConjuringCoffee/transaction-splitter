import { List, RadioButton } from 'react-native-paper';
import { Profile } from '../../redux/features/profiles/profilesSlice';
import React from 'react';

interface Props {
    profiles: Profile[],
    payerProfileIndex: number,
    setPayerProfileIndex: (index: number) => void,
}

export const PayerProfileSelection = (props: Props) => {
    return (
        <>
            <List.Section title='Payer profile'>
                <RadioButton.Group
                    onValueChange={(newValue) => props.setPayerProfileIndex(Number(newValue))}
                    value={props.payerProfileIndex.toString()}
                >
                    <RadioButton.Item label={props.profiles[0].name} value={'0'} />
                    <RadioButton.Item label={props.profiles[1].name} value={'1'} />
                </RadioButton.Group>
            </List.Section>
        </>
    );
};
