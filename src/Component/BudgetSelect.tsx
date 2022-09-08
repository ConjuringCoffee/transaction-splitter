import React, { useEffect } from 'react';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { Budget } from '../YnabApi/YnabApiWrapper';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
    budgets: Array<Budget>,
    selectedBudgetId?: string,
    label: string,
    onBudgetSelect: (budgetID: string) => void,
    style?: StyleProp<ViewStyle>
}

const concatenateIdentifiers = (budgets: Array<Budget>): string => {
    return budgets.reduce(((result: string, budget: Budget) => {
        return `${result}${budget.id};`;
    }), '');
};

const renderOption = (budget: Budget) => (
    <SelectItem
        title={budget.name}
        key={budget.id} />
);

export const BudgetSelect = ({ selectedBudgetId, budgets, onBudgetSelect, style, label }: Props) => {
    const budgetIdentifiers = concatenateIdentifiers(budgets);

    useEffect(() => {
        if (selectedBudgetId === undefined || budgets.findIndex((e) => e.id === selectedBudgetId) === -1) {
            onBudgetSelect(budgets[0].id);
        }
    }, [budgetIdentifiers, selectedBudgetId, budgets, onBudgetSelect]);

    const onSelect = (newIndexPath: IndexPath | IndexPath[]) => {
        if (!(newIndexPath instanceof IndexPath)) {
            throw new Error('Unexpected type of IndexPath');
        }
        onBudgetSelect(budgets[newIndexPath.row].id);
    };

    let index = 0;

    if (selectedBudgetId !== undefined) {
        index = budgets.findIndex((e) => e.id === selectedBudgetId);

        if (index === -1) {
            index = 0;
        }
    }

    const indexPath = new IndexPath(index);
    const displayValue = budgets[indexPath.row].name;

    return (
        <Select
            style={style}
            label={label}
            value={displayValue}
            selectedIndex={indexPath}
            onSelect={(newIndexPath) => onSelect(newIndexPath)}>
            {budgets.map(renderOption)}
        </Select>
    );
};
