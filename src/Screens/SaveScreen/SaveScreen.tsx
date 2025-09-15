import React, { useCallback, useEffect, useState } from 'react';
import { createTransaction } from '../../YnabApi/YnabApiWrapper';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { SaveTransactionListSection } from './SaveTransactionListSection';
import { SaveFAB } from './SaveFAB';
import { useNavigationSettings } from '../../Hooks/useNavigationSettings';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { View } from 'react-native';

type ScreenName = 'Save';

const SCREEN_TITLE = 'Save';

export const SaveScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const accessToken = useAppSelector(selectAccessToken);

    const {
        basicData,
        payerSaveTransaction,
        debtorSaveTransaction,
    } = route.params;

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    useEffect(() => {
        const navigate = () => {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenNames.SPLITTING_SCREEN }],
            });
        };

        if (payerTransactionSaveStatus === LoadingStatus.SUCCESSFUL && debtorTransactionSaveStatus === LoadingStatus.SUCCESSFUL) {
            setTimeout(navigate, 200);
        }
    }, [navigation, payerTransactionSaveStatus, debtorTransactionSaveStatus]);

    const save = useCallback(
        (): void => {
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
        },
        [accessToken, basicData.debtor.budgetId, basicData.payer.budgetId, debtorSaveTransaction, payerSaveTransaction],
    );

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
        <View>
            <CustomScrollView>
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
            </CustomScrollView>
            <SaveFAB
                saveStatus={overallSaveStatus}
                save={save}
            />
        </View>
    );
};
