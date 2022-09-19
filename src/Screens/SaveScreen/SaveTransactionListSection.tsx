import React, { useState } from 'react';
import { DataTable, List, Text, useTheme } from 'react-native-paper';
import { SaveTransaction } from 'ynab';
import { StyleSheet } from 'react-native';
import { convertApiAmountToHumanAmount } from '../../Helper/AmountHelper';
import { NumberFormatSettings } from '../../Hooks/useLocalization';
import { selectBudgetById, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../redux/hooks';
import { DataTableCellView } from './DataTableCellView';
import { SubTransactionsDataTable } from './SubTransactionsDataTable';

interface Props {
    saveTransaction: SaveTransaction,
    sectionTitle: string,
    budgetId: string,
    payeeName: string,
    memo: string,
    numberFormatSettings: NumberFormatSettings,
}

export const SaveTransactionListSection = (props: Props) => {
    const [detailsExpanded, setDetailsExpanded] = useState<boolean>(true);
    const [subTransactionsExpanded, setSubTransactionsExpanded] = useState<boolean>(true);
    const theme = useTheme();

    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));

    const accountName = budget.accounts.find((account) => account.id === props.saveTransaction.account_id)?.name;
    const amountText = convertApiAmountToHumanAmount(props.saveTransaction.amount);

    const toggleDetailsExpanded = () => setDetailsExpanded(!detailsExpanded);
    const toggleSubTransactionsExpanded = () => setSubTransactionsExpanded(!subTransactionsExpanded);


    const styles = StyleSheet.create({
        sectionTitle: {
            fontSize: 20,
            color: theme.colors.text,
        },
        subTransactionListSection: {
            paddingTop: 20,
        },
    });

    return (
        <List.Section title={props.sectionTitle} titleStyle={styles.sectionTitle}>
            <List.Accordion
                title='Transaction details'
                expanded={detailsExpanded}
                onPress={toggleDetailsExpanded}
            >
                <DataTable>
                    <DataTable.Row>
                        <DataTable.Cell>Budget</DataTable.Cell>
                        <DataTable.Cell>{budget.name}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Account</DataTable.Cell>
                        <DataTable.Cell>{accountName}</DataTable.Cell>
                    </DataTable.Row>
                    {props.saveTransaction.category_id
                        ? <DataTable.Row>
                            <DataTable.Cell>Category</DataTable.Cell>
                            <DataTable.Cell>{categories[props.saveTransaction.category_id].name}</DataTable.Cell>
                        </DataTable.Row>
                        : null}
                    <DataTable.Row>
                        <DataTable.Cell>Total Amount</DataTable.Cell>
                        <DataTable.Cell>{amountText}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Payee</DataTable.Cell>
                        <DataTable.Cell>{props.payeeName}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Memo</DataTable.Cell>
                        <DataTableCellView>
                            <Text numberOfLines={3}>{props.memo}</Text>
                        </DataTableCellView>
                    </DataTable.Row>
                </DataTable>
            </List.Accordion>
            {props.saveTransaction.subtransactions
                ? <List.Accordion title='Subtransactions'
                    expanded={subTransactionsExpanded}
                    onPress={toggleSubTransactionsExpanded}
                    style={styles.subTransactionListSection}
                >
                    <SubTransactionsDataTable
                        budgetId={props.budgetId}
                        subTransactions={props.saveTransaction.subtransactions}
                        numberFormatSettings={props.numberFormatSettings}
                    />
                </List.Accordion>
                : null}
        </List.Section>
    );
};
