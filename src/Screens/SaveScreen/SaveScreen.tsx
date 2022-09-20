import React, { useEffect, useState } from 'react';
import { createTransaction } from '../../YnabApi/YnabApiWrapper';
import { ScrollView } from 'react-native-gesture-handler';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppSelector } from '../../redux/hooks';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { SaveTransactionListSection } from './SaveTransactionListSection';
import { SaveFAB } from './SaveFAB';

type ScreenName = 'Save';

export const SaveScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const accessToken = useAppSelector(selectAccessToken);

    const {
        basicData,
        payerSaveTransaction,
        debtorSaveTransaction,
    } = route.params;

    useEffect(() => {
        const navigate = async () => {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenNames.SPLITTING_SCREEN }],
            });
        };

        if (payerTransactionSaveStatus === LoadingStatus.SUCCESSFUL && debtorTransactionSaveStatus === LoadingStatus.SUCCESSFUL) {
            setTimeout(navigate, 500);
        }
    }, [navigation, payerTransactionSaveStatus, debtorTransactionSaveStatus]);

    const save = () => {
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
    };

    const getOverallSaveStatus = (): LoadingStatus => {
        if (payerTransactionSaveStatus === LoadingStatus.ERROR || debtorTransactionSaveStatus === LoadingStatus.ERROR) {
            return LoadingStatus.ERROR;
        } else if (payerTransactionSaveStatus === LoadingStatus.SUCCESSFUL && debtorTransactionSaveStatus === LoadingStatus.SUCCESSFUL) {
            return LoadingStatus.SUCCESSFUL;
        } else if (payerTransactionSaveStatus === LoadingStatus.IDLE && debtorTransactionSaveStatus === LoadingStatus.IDLE) {
            return LoadingStatus.IDLE;
        } else {
            return LoadingStatus.LOADING;
        }
    };

    const overallSaveStatus = getOverallSaveStatus();

    return (
        <>
            <ScrollView>
                <SaveTransactionListSection
                    saveTransaction={payerSaveTransaction}
                    sectionTitle='Payer transaction'
                    budgetId={basicData.payer.budgetId}
                    payeeName={basicData.payeeName}
                    memo={basicData.memo}
                />

                <SaveTransactionListSection
                    saveTransaction={debtorSaveTransaction}
                    sectionTitle='Debtor transaction'
                    budgetId={basicData.debtor.budgetId}
                    payeeName={basicData.payeeName}
                    memo={basicData.memo}
                />
            </ScrollView>
            <SaveFAB
                saveStatus={overallSaveStatus}
                save={save}
            />
        </>
    );
};
