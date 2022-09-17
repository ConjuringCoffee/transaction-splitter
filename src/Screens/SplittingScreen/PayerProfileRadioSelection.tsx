import { List, RadioButton } from 'react-native-paper';
import { Profile } from '../../redux/features/profiles/profilesSlice';
import React from 'react';

interface Props {
    profiles: Profile[],
    payerProfileIndex: number,
    setPayerProfileIndex: (index: number) => void,
}

export const PayerProfileRadioSelection = (props: Props) => {
    const renderItem = (profile: Profile, index: number) => (
        <RadioButton.Item
            key={profile.budgetId}
            label={profile.name}
            value={index.toString()} />
    );
    return (
        <List.Section title='Payer profile'>
            <RadioButton.Group
                onValueChange={(newValue) => props.setPayerProfileIndex(Number(newValue))}
                value={props.payerProfileIndex.toString()}
            >
                {props.profiles.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
