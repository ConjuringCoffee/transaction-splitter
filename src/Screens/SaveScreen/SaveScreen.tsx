import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { createTransaction } from '../../YnabApi/YnabApiWrapper';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { useLocalization } from '../../Hooks/useLocalization';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppSelector } from '../../redux/hooks';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { SaveTransactionListSection } from './SaveTransactionListSection';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Save'>;
type MyRouteProp = RouteProp<StackParameterList, 'Save'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const SaveScreen = ({ navigation, route }: Props) => {
    const { numberFormatSettings } = useLocalization();

    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);

    const { basicData } = route.params;
    const { payerSaveTransaction } = route.params;
    const { debtorSaveTransaction } = route.params;

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
                        <SaveTransactionListSection
                            saveTransaction={payerSaveTransaction}
                            sectionTitle='Payer transaction'
                            budgetId={basicData.payer.budgetId}
                            payeeName={basicData.payeeName}
                            memo={basicData.memo}
                            numberFormatSettings={numberFormatSettings}
                        />

                        <SaveTransactionListSection
                            saveTransaction={debtorSaveTransaction}
                            sectionTitle='Debtor transaction'
                            budgetId={basicData.debtor.budgetId}
                            payeeName={basicData.payeeName}
                            memo={basicData.memo}
                            numberFormatSettings={numberFormatSettings}
                        />
                    </ScrollView>
                    <Button
                        style={styles.button}
                        onPress={() => {
                            setPayerTransactionSaveStatus(LoadingStatus.LOADING);
                            setDebtorTransactionSaveStatus(LoadingStatus.LOADING);

                            createTransaction(basicData.payer.budgetId, payerSaveTransaction, accessToken)
                                .then(() => {
                                    setPayerTransactionSaveStatus(LoadingStatus.SUCCESSFUL);
                                }).catch((error) => {
                                    console.error(error);
                                    setPayerTransactionSaveStatus(LoadingStatus.ERROR);
                                });

                            createTransaction(basicData.debtor.budgetId, debtorSaveTransaction, accessToken)
                                .then(() => {
                                    setDebtorTransactionSaveStatus(LoadingStatus.SUCCESSFUL);
                                }).catch((error) => {
                                    console.error(error);
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
