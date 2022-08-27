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

const BudgetSelect = (props: Props) => {
    const budgetIdentifiers = concatenateIdentifiers(props.budgets);

    useEffect(() => {
        if (props.selectedBudgetId === undefined || props.budgets.findIndex((e) => e.id === props.selectedBudgetId) === -1) {
            props.onBudgetSelect(props.budgets[0].id);
        }
    }, [budgetIdentifiers]);

    const onSelect = (newIndexPath: IndexPath | IndexPath[]) => {
        if (!(newIndexPath instanceof IndexPath)) {
            throw new Error('Unexpected type of IndexPath');
        }
        props.onBudgetSelect(props.budgets[newIndexPath.row].id);
    };

    let index = 0;

    if (props.selectedBudgetId !== undefined) {
        index = props.budgets.findIndex((e) => e.id === props.selectedBudgetId);

        if (index === -1) {
            index = 0;
        }
    }

    const indexPath = new IndexPath(index);
    const displayValue = props.budgets[indexPath.row].name;

    return (
        <Select
            style={props.style}
            label={props.label}
            value={displayValue}
            selectedIndex={indexPath}
            onSelect={(newIndexPath) => onSelect(newIndexPath)}>
            {props.budgets.map(renderOption)}
        </Select>
    );
};

export default BudgetSelect;
