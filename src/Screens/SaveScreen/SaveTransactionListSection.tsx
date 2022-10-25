import React, { useState } from 'react';
import { DataTable, List, useTheme } from 'react-native-paper';
import { SaveTransaction } from 'ynab';
import { StyleSheet } from 'react-native';
import { convertAmountToText, convertApiAmountToHumanAmount } from '../../Helper/AmountHelper';
import { selectBudgetById, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../redux/hooks';
import { SubTransactionsDataTable } from './SubTransactionsDataTable';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { MultiLineTextDataTableCellView } from './MultiLineTextDataTableCellView';

interface Props {
    saveTransaction: SaveTransaction,
    sectionTitle: string,
    budgetId: string,
    payeeName: string,
    memo: string,
}

export const SaveTransactionListSection = (props: Props) => {
    const [detailsExpanded, setDetailsExpanded] = useState<boolean>(true);
    const [subTransactionsExpanded, setSubTransactionsExpanded] = useState<boolean>(true);
    const theme = useTheme();

    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const accountName = budget.accounts.find((account) => account.id === props.saveTransaction.account_id)?.name;
    const amountHuman = convertApiAmountToHumanAmount(props.saveTransaction.amount);
    const amountText = convertAmountToText(amountHuman, numberFormatSettings);

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
                        <MultiLineTextDataTableCellView text={budget.name} />
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Account</DataTable.Cell>
                        <MultiLineTextDataTableCellView text={accountName} />
                    </DataTable.Row>
                    {props.saveTransaction.category_id
                        ? <DataTable.Row>
                            <DataTable.Cell>Category</DataTable.Cell>
                            <MultiLineTextDataTableCellView text={categories[props.saveTransaction.category_id].name} />
                        </DataTable.Row>
                        : null}
                    <DataTable.Row>
                        <DataTable.Cell>Total Amount</DataTable.Cell>
                        <DataTable.Cell>{amountText}</DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Payee</DataTable.Cell>
                        <MultiLineTextDataTableCellView text={props.payeeName} />
                    </DataTable.Row>
                    <DataTable.Row>
                        <DataTable.Cell>Memo</DataTable.Cell>
                        <MultiLineTextDataTableCellView text={props.memo} />
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
                    />
                </List.Accordion>
                : null}
        </List.Section>
    );
};
