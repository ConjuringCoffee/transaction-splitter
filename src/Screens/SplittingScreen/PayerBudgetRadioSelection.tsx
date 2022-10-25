import { List, RadioButton } from 'react-native-paper';
import { BudgetInProfile, Profile } from '../../redux/features/profiles/profilesSlice';
import React, { useCallback } from 'react';
import { Keyboard } from 'react-native';

interface Props {
    profile: Profile,
    payerBudgetIndex: number,
    setPayerBudgetIndex: (index: number) => void,
}

export const PayerBudgetRadioSelection = (props: Props) => {
    const { setPayerBudgetIndex } = props;

    const onValueChange = useCallback((newValue: string) => {
        Keyboard.dismiss();
        setPayerBudgetIndex(Number(newValue));
    }, [setPayerBudgetIndex]);

    const renderItem = (budgetInProfile: BudgetInProfile, index: number) => (
        <RadioButton.Item
            key={budgetInProfile.budgetId}
            // TODO: Use original budget name if empty
            label={budgetInProfile.name ?? '???'}
            value={index.toString()}
        />
    );

    return (
        <List.Section title='Payer budget'>
            <RadioButton.Group
                onValueChange={onValueChange}
                value={props.payerBudgetIndex.toString()}
            >
                {props.profile.budgets.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
