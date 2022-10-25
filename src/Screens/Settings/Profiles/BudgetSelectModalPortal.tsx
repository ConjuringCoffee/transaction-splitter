import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, useTheme, List } from 'react-native-paper';
import { selectBudgets } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { Budget } from '../../../YnabApi/YnabApiWrapper';

interface Props {
    visible: boolean,
    toggleVisible: () => void,
    selectedBudgetId?: string,
    selectBudgetId: (budgetId: string) => void,
}

export const BudgetSelectModalPortal = (props: Props) => {
    const theme = useTheme();
    const budgets = useAppSelector(selectBudgets);

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            // TODO: Remove code duplication to ThemeModalPortal
            padding: 20,
            margin: 20,
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.background,
        },
    }), [theme]);

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
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.toggleVisible}
                contentContainerStyle={styles.modalContainer}
            >
                {budgets.map(renderListItem)}
            </Modal>
        </Portal>
    );
};
