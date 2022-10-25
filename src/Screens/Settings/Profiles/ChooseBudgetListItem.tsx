import React, { useState } from 'react';
import { List } from 'react-native-paper';
import { selectBudgets } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { BudgetSelectModalPortal } from './BudgetSelectModalPortal';

interface Props {
    selectedBudgetId?: string,
    selectBudgetId: (budgetId: string) => void,
}

const ICON_BUDGET_SET = 'check-circle-outline';
const ICON_BUDGET_NOT_SET = 'checkbox-blank-circle-outline';

export const ChooseBudgetListItem = (props: Props) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const budgets = useAppSelector(selectBudgets);

    const budgetName = props.selectedBudgetId ? budgets.find((budget) => budget.id === props.selectedBudgetId)?.name : undefined;

    return (
        <>
            <List.Item
                title={budgetName ?? 'No budget selected'}
                left={(props) => <List.Icon {...props} icon={budgetName ? ICON_BUDGET_SET : ICON_BUDGET_NOT_SET} />}
                onPress={() => setModalVisible(true)}
            />
            <BudgetSelectModalPortal
                visible={modalVisible}
                toggleVisible={() => setModalVisible(!modalVisible)}
                selectedBudgetId={props.selectedBudgetId}
                selectBudgetId={props.selectBudgetId}
            />
        </>
    );
};
