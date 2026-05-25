import React, { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { BudgetInProfile, selectProfile } from '../../redux/features/profile/profileSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectBudgets } from '../../redux/features/ynab/ynabSlice';

type Props = {
    payerBudgetIndex: number,
    setPayerBudgetIndex: (index: number) => void,
}

export const PayerBudgetSelection = ({ payerBudgetIndex, setPayerBudgetIndex }: Props) => {
    const profile = useAppSelector(selectProfile);
    const budgets = useAppSelector(selectBudgets);

    const onValueChange = useCallback((newValue: string) => {
        Keyboard.dismiss();
        setPayerBudgetIndex(Number(newValue));
    }, [setPayerBudgetIndex]);

    const buttons = profile!.budgets.map((budgetInProfile: BudgetInProfile, index: number) => {
        const displayedName = budgetInProfile.name ?? budgets.find((budget) => budget.id === budgetInProfile.budgetId)?.name;

        if (displayedName === undefined) {
            throw new Error(`Budget for ID ${budgetInProfile.budgetId} was not found`);
        }

        return { value: index.toString(), label: displayedName };
    });

    return (
        <SegmentedButtons
            value={payerBudgetIndex.toString()}
            onValueChange={onValueChange}
            buttons={buttons}
        />
    );
};
