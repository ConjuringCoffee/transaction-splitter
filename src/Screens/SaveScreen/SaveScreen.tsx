import { useEffect, useState } from 'react';
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
import { selectAccountById, selectBudgetById } from '../../redux/features/ynab/ynabSlice';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Save'>;
type MyRouteProp = RouteProp<StackParameterList, 'Save'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

enum SaveStatus {
    NotStarted,
    InProgress,
    Success,
    Failure
}

export const SaveScreen = ({ navigation, route }: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [payerTransactionStatus, setPayerTransactionStatus] = useState<string>('primary');
    const [debtorTransactionStatus, setDebtorTransactionStatus] = useState<string>('primary');

    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<SaveStatus>(SaveStatus.NotStarted);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<SaveStatus>(SaveStatus.NotStarted);

    const { basicData } = route.params;
    const { payerSaveTransaction } = route.params;
    const { debtorSaveTransaction } = route.params;

    const payerBudget = useAppSelector((state) => selectBudgetById(state, basicData.payer.budgetId));
    const debtorBudget = useAppSelector((state) => selectBudgetById(state, basicData.debtor.budgetId));
    const payerTransferAccount = useAppSelector((state) => selectAccountById(state, basicData.payer.budgetId, basicData.payer.transferAccountId));
    const accessToken = useAppSelector(selectAccessToken);

    useEffect(() => {
        if (payerTransactionSaveStatus === SaveStatus.Success && debtorTransactionSaveStatus === SaveStatus.Success) {
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
                        <TransactionCard
                            numberFormatSettings={numberFormatSettings}
                            status={payerTransactionStatus}
                            title='Payer transaction'
                            basicData={basicData}
                            saveTransaction={payerSaveTransaction}
                            budget={payerBudget}
                            transferAccount={payerTransferAccount} />

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
                            setPayerTransactionSaveStatus(SaveStatus.InProgress);
                            setDebtorTransactionSaveStatus(SaveStatus.InProgress);
                            setPayerTransactionStatus('info');
                            setDebtorTransactionStatus('info');

                            createTransaction(basicData.payer.budgetId, payerSaveTransaction, accessToken)
                                .then(() => {
                                    setPayerTransactionStatus('success');
                                    setPayerTransactionSaveStatus(SaveStatus.Success);
                                }).catch((error) => {
                                    console.error(error);
                                    setPayerTransactionStatus('danger');
                                    setPayerTransactionSaveStatus(SaveStatus.Failure);
                                });

                            createTransaction(basicData.debtor.budgetId, debtorSaveTransaction, accessToken)
                                .then(() => {
                                    setDebtorTransactionStatus('success');
                                    setDebtorTransactionSaveStatus(SaveStatus.Success);
                                }).catch((error) => {
                                    console.error(error);
                                    setDebtorTransactionStatus('danger');
                                    setDebtorTransactionSaveStatus(SaveStatus.Failure);
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
