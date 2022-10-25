import { List, RadioButton } from 'react-native-paper';
import { BudgetInProfile, Profile } from '../../redux/features/profiles/profilesSlice';
import React, { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { selectBudgets } from '../../redux/features/ynab/ynabSlice';

interface Props {
    profile: Profile,
    payerBudgetIndex: number,
    setPayerBudgetIndex: (index: number) => void,
}

export const PayerBudgetRadioSelection = ({ profile, payerBudgetIndex, setPayerBudgetIndex }: Props) => {
    const budgets = useAppSelector(selectBudgets);

    const onValueChange = useCallback((newValue: string) => {
        Keyboard.dismiss();
        setPayerBudgetIndex(Number(newValue));
    }, [setPayerBudgetIndex]);

    const renderItem = useCallback((budgetInProfile: BudgetInProfile, index: number) => {
        const displayedName = budgetInProfile.name ?? budgets.find((budget) => budget.id === budgetInProfile.budgetId)?.name;

        if (displayedName === undefined) {
            throw new Error(`Budget for ID ${budgetInProfile.budgetId} was not found`);
        }

        return (<RadioButton.Item
            key={budgetInProfile.budgetId}
            label={displayedName}
            value={index.toString()}
        />);
    }, [budgets]);

    return (
        <List.Section title='Payer budget'>
            <RadioButton.Group
                onValueChange={onValueChange}
                value={payerBudgetIndex.toString()}
            >
                {profile.budgets.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
