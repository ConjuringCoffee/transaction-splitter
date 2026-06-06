import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, DataTable, Icon, List, Text } from 'react-native-paper';
import { SaveTransaction } from 'ynab';
import { convertApiAmountToHumanAmount } from '../../Helper/AmountHelper';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { selectBudgetById, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { SubTransactionsDataTable } from './SubTransactionsDataTable';
import { MultiLineTextDataTableCellView } from './MultiLineTextDataTableCellView';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useCurrencyFormat } from '../../Hooks/useCurrencyFormat';
import { useTheme } from '../../Hooks/useTheme';
import { CardSurface } from '../../Component/CardSurface';

type Props = {
    saveTransaction: SaveTransaction,
    sectionTitle: string,
    budgetId: string,
    payeeName: string,
    memo: string,
    saveStatus: LoadingStatus,
}

const SaveStatusIndicator = ({ saveStatus }: { saveStatus: LoadingStatus }) => {
    const [theme] = useTheme();

    if (saveStatus === LoadingStatus.LOADING) {
        return <ActivityIndicator />;
    }
    if (saveStatus === LoadingStatus.SUCCESSFUL) {
        return <Icon source='check-circle-outline' size={20} color={theme.colors.primary} />;
    }
    if (saveStatus === LoadingStatus.ERROR) {
        return <Icon source='close-circle-outline' size={20} color={theme.colors.error} />;
    }
    return null;
};

export const SaveTransactionListSection = (props: Props) => {
    const [theme] = useTheme();
    const [, convertNumberToText] = useAmountConversion();
    const { formatAmount } = useCurrencyFormat(props.budgetId);
    const [detailsExpanded, setDetailsExpanded] = useState<boolean>(true);
    const [subTransactionsExpanded, setSubTransactionsExpanded] = useState<boolean>(true);

    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));

    const accountName = budget.accounts.find((account) => account.id === props.saveTransaction.account_id)?.name;
    const amountHuman = convertApiAmountToHumanAmount(props.saveTransaction.amount);
    const amountText = formatAmount(convertNumberToText(amountHuman));

    const toggleDetailsExpanded = useCallback(
        (): void => setDetailsExpanded(!detailsExpanded),
        [detailsExpanded],
    );

    const toggleSubTransactionsExpanded = useCallback(
        (): void => setSubTransactionsExpanded(!subTransactionsExpanded),
        [subTransactionsExpanded],
    );

    return (
        <CardSurface elevation={1}>
            <List.Section>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }}>
                    <Text variant='titleLarge'>{props.sectionTitle}</Text>
                    <SaveStatusIndicator saveStatus={props.saveStatus} />
                </View>
                <List.Accordion
                    title='Transaction details'
                    expanded={detailsExpanded}
                    onPress={toggleDetailsExpanded}
                    style={{ backgroundColor: theme.colors.elevation.level1 }}
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
                            ? (
                                <DataTable.Row>
                                    <DataTable.Cell>Category</DataTable.Cell>
                                    <MultiLineTextDataTableCellView text={categories[props.saveTransaction.category_id].name} />
                                </DataTable.Row>
                            )
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
                        <DataTable.Row>
                            <DataTable.Cell>Approved</DataTable.Cell>
                            <DataTable.Cell>{props.saveTransaction.approved ? 'Yes' : 'No'}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </List.Accordion>
                {props.saveTransaction.subtransactions
                    ? (
                        <List.Accordion
                            title='Subtransactions'
                            expanded={subTransactionsExpanded}
                            onPress={toggleSubTransactionsExpanded}
                            style={{ backgroundColor: theme.colors.elevation.level1 }}
                        >
                            <SubTransactionsDataTable
                                budgetId={props.budgetId}
                                subTransactions={props.saveTransaction.subtransactions}
                            />
                        </List.Accordion>
                    )
                    : null}
            </List.Section>
        </CardSurface>
    );
};
