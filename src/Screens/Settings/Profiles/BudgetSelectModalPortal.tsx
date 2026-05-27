import React from 'react';
import { List } from 'react-native-paper';
import { selectBudgets } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { Budget } from '../../../YnabApi/YnabApiWrapper';
import { PortalModal } from '../../../Component/PortalModal';

type Props = {
    visible: boolean,
    toggleVisible: () => void,
    selectedBudgetId?: string,
    selectBudgetId: (budgetId: string) => void,
}

export const BudgetSelectModalPortal = (props: Props) => {
    const budgets = useAppSelector(selectBudgets);

    const renderListItem = (budget: Budget) => (
        <List.Item
            key={budget.id}
            title={budget.name}
            onPress={() => {
                if (props.selectedBudgetId !== budget.id) {
                    props.selectBudgetId(budget.id);
                }
                props.toggleVisible();
            }}
        />
    );

    return (
        <PortalModal
            visible={props.visible}
            toggleVisible={props.toggleVisible}
        >
            {budgets.map(renderListItem)}
        </PortalModal>
    );
};
