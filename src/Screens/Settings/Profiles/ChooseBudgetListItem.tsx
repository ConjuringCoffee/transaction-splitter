import React, { useCallback, useState } from 'react';
import { List } from 'react-native-paper';
import { selectBudgets } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { BudgetSelectModalPortal } from './BudgetSelectModalPortal';
import { View } from 'react-native';

type Props = {
    selectedBudgetId?: string,
    selectBudgetId: (budgetId: string) => void,
}

const ICON_BUDGET_SET = 'check-circle-outline';
const ICON_BUDGET_NOT_SET = 'checkbox-blank-circle-outline';

export const ChooseBudgetListItem = (props: Props) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const budgets = useAppSelector(selectBudgets);

    const showModal = useCallback(
        (): void => setModalVisible(true),
        [],
    );

    const toggleModalVisibility = useCallback(
        (): void => setModalVisible(!modalVisible),
        [modalVisible],
    );

    const budgetName = props.selectedBudgetId ? budgets.find((budget) => budget.id === props.selectedBudgetId)?.name : undefined;

    const listIcon = useCallback(
        (props: object) => {
            const icon = budgetName ? ICON_BUDGET_SET : ICON_BUDGET_NOT_SET;
            return <List.Icon {...props} icon={icon} />;
        },
        [budgetName],
    );

    return (
        <View>
            <List.Item
                title={budgetName ?? 'No budget selected'}
                left={listIcon}
                onPress={showModal}
            />
            <BudgetSelectModalPortal
                visible={modalVisible}
                toggleVisible={toggleModalVisibility}
                selectedBudgetId={props.selectedBudgetId}
                selectBudgetId={props.selectBudgetId}
            />
        </View>
    );
};
