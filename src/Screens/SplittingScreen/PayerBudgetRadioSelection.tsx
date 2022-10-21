import { List, RadioButton } from 'react-native-paper';
import { BudgetInProfile, Profile } from '../../redux/features/profiles/profilesSlice';
import React from 'react';

interface Props {
    profile: Profile,
    payerBudgetIndex: number,
    setPayerBudgetIndex: (index: number) => void,
}

export const PayerBudgetRadioSelection = (props: Props) => {
    const renderItem = (budgetInProfile: BudgetInProfile, index: number) => (
        <RadioButton.Item
            key={budgetInProfile.budgetId}
            // TODO: Use original budget name if empty
            label={budgetInProfile.name ?? '???'}
            value={index.toString()} />
    );
    return (
        <List.Section title='Payer budget'>
            <RadioButton.Group
                onValueChange={(newValue) => props.setPayerBudgetIndex(Number(newValue))}
                value={props.payerBudgetIndex.toString()}
            >
                {props.profile.budgets.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
