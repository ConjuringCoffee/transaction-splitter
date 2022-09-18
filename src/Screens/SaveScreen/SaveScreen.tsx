import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { createTransaction } from '../../YnabApi/YnabApiWrapper';
import { ScrollView } from 'react-native-gesture-handler';
import { TransactionCard } from './TransactionCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { useLocalization } from '../../Hooks/useLocalization';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppSelector } from '../../redux/hooks';
import { selectBudgetById } from '../../redux/features/ynab/ynabSlice';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { DataTable, List, Text } from 'react-native-paper';
import { SubTransactionsDataTable } from './SubTransactionsDataTable';
import { DataTableCellView } from './DataTableCellView';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Save'>;
type MyRouteProp = RouteProp<StackParameterList, 'Save'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const SaveScreen = ({ navigation, route }: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [debtorTransactionStatus, setDebtorTransactionStatus] = useState<string>('primary');

    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

    const { basicData } = route.params;
    const { payerSaveTransaction } = route.params;
    const { debtorSaveTransaction } = route.params;

    const payerBudget = useAppSelector((state) => selectBudgetById(state, basicData.payer.budgetId));
    const debtorBudget = useAppSelector((state) => selectBudgetById(state, basicData.debtor.budgetId));
    const accessToken = useAppSelector(selectAccessToken);

    useEffect(() => {
        if (payerTransactionSaveStatus === LoadingStatus.SUCCESSFUL && debtorTransactionSaveStatus === LoadingStatus.SUCCESSFUL) {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenNames.SPLITTING_SCREEN }],
            });
        }
    }, [navigation, payerTransactionSaveStatus, debtorTransactionSaveStatus]);

    return (
        <>
            {numberFormatSettings
                ? <>
                    <ScrollView>
                        <List.Section title='Payer transaction'>
                            <List.Accordion title='Transaction details'>
                                <DataTable>
                                    <DataTable.Row>
                                        <DataTable.Cell>Budget</DataTable.Cell>
                                        <DataTable.Cell>{payerBudget.name}</DataTable.Cell>
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Cell>Account</DataTable.Cell>
                                        {/* TOOD: Encapsulate account name determination */}
                                        <DataTable.Cell>{payerBudget.accounts.find((account) => account.id === payerSaveTransaction.account_id)?.name}</DataTable.Cell>
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Cell>Payee</DataTable.Cell>
                                        <DataTable.Cell>{basicData.payeeName}</DataTable.Cell>
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Cell>Memo</DataTable.Cell>
                                        <DataTableCellView>
                                            <Text numberOfLines={3}>{basicData.memo}</Text>
                                        </DataTableCellView>
                                    </DataTable.Row>
                                </DataTable>
                            </List.Accordion>
                            {payerSaveTransaction.subtransactions
                                ? <List.Accordion title='Sub-Transactions'>
                                    <SubTransactionsDataTable
                                        budgetId={payerBudget.id}
                                        subTransactions={payerSaveTransaction.subtransactions}
                                        numberFormatSettings={numberFormatSettings}
                                    />
                                </List.Accordion>
                                : null}
                        </List.Section>

                        <TransactionCard
                            numberFormatSettings={numberFormatSettings}
                            status={debtorTransactionStatus}
                            title='Debtor transaction'
                            basicData={basicData}
                            saveTransaction={debtorSaveTransaction}
                            budget={debtorBudget} />
                    </ScrollView>
                    <Button
                        style={styles.button}
                        onPress={() => {
                            setPayerTransactionSaveStatus(LoadingStatus.LOADING);
                            setDebtorTransactionSaveStatus(LoadingStatus.LOADING);
                            setDebtorTransactionStatus('info');

                            createTransaction(basicData.payer.budgetId, payerSaveTransaction, accessToken)
                                .then(() => {
                                    setPayerTransactionSaveStatus(LoadingStatus.SUCCESSFUL);
                                }).catch((error) => {
                                    console.error(error);
                                    setPayerTransactionSaveStatus(LoadingStatus.ERROR);
                                });

                            createTransaction(basicData.debtor.budgetId, debtorSaveTransaction, accessToken)
                                .then(() => {
                                    setDebtorTransactionStatus('success');
                                    setDebtorTransactionSaveStatus(LoadingStatus.SUCCESSFUL);
                                }).catch((error) => {
                                    console.error(error);
                                    setDebtorTransactionStatus('danger');
                                    setDebtorTransactionSaveStatus(LoadingStatus.ERROR);
                                });
                        }}>
                        Save transactions
                    </Button>
                </>
                : <LoadingComponent />}
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        margin: 6,
    },
});
