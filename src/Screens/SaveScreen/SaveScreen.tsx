import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createTransaction } from '../../YnabApi/YnabApiWrapper';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { SaveTransactionListSection } from './SaveTransactionListSection';
import { useNavigationSettings } from '../../Hooks/useNavigationSettings';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useTheme } from '../../Hooks/useTheme';

type ScreenName = 'Save';

const SCREEN_TITLE = 'Save';

export const SaveScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [theme] = useTheme();
    const [payerTransactionSaveStatus, setPayerTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [debtorTransactionSaveStatus, setDebtorTransactionSaveStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const accessToken = useAppSelector(selectAccessToken);
    /** Ref so the double-tap guard is synchronous, before React re-renders the button as disabled. */
    const isSavingRef = useRef(false);

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
            if (isSavingRef.current) {
                return;
            }
            isSavingRef.current = true;

            const promises: Promise<void>[] = [];

            if (payerTransactionSaveStatus !== LoadingStatus.SUCCESSFUL) {
                setPayerTransactionSaveStatus(LoadingStatus.LOADING);
                promises.push(
                    createTransaction(basicData.payer.budgetId, payerSaveTransaction, accessToken)
                        .then(() => setPayerTransactionSaveStatus(LoadingStatus.SUCCESSFUL))
                        .catch((error) => {
                            console.error(error);
                            setPayerTransactionSaveStatus(LoadingStatus.ERROR);
                        }),
                );
            }

            if (debtorTransactionSaveStatus !== LoadingStatus.SUCCESSFUL) {
                setDebtorTransactionSaveStatus(LoadingStatus.LOADING);
                promises.push(
                    createTransaction(basicData.debtor.budgetId, debtorSaveTransaction, accessToken)
                        .then(() => setDebtorTransactionSaveStatus(LoadingStatus.SUCCESSFUL))
                        .catch((error) => {
                            console.error(error);
                            setDebtorTransactionSaveStatus(LoadingStatus.ERROR);
                        }),
                );
            }

            Promise.allSettled(promises).then(() => {
                isSavingRef.current = false;
            });
        },
        [accessToken, basicData.debtor.budgetId, basicData.payer.budgetId, debtorSaveTransaction, payerSaveTransaction, payerTransactionSaveStatus, debtorTransactionSaveStatus],
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

    let saveButtonIcon = 'check';
    if (overallSaveStatus === LoadingStatus.ERROR) {
        saveButtonIcon = 'close-circle-outline';
    } else if (overallSaveStatus === LoadingStatus.SUCCESSFUL) {
        saveButtonIcon = 'check-circle-outline';
    }

    return (
        <View style={{ flex: 1 }}>
            <CustomScrollView>
                <View style={{ gap: theme.spacing }}>
                    <SaveTransactionListSection
                        saveTransaction={payerSaveTransaction}
                        sectionTitle='Payer transaction'
                        budgetId={basicData.payer.budgetId}
                        payeeName={basicData.payeeName}
                        memo={basicData.memo}
                        saveStatus={payerTransactionSaveStatus}
                    />
                    <SaveTransactionListSection
                        saveTransaction={debtorSaveTransaction}
                        sectionTitle='Debtor transaction'
                        budgetId={basicData.debtor.budgetId}
                        payeeName={basicData.payeeName}
                        memo={basicData.memo}
                        saveStatus={debtorTransactionSaveStatus}
                    />
                </View>
            </CustomScrollView>
            <View style={{ padding: theme.cardPadding }}>
                <Button
                    mode='contained'
                    loading={overallSaveStatus === LoadingStatus.LOADING}
                    disabled={overallSaveStatus === LoadingStatus.LOADING || overallSaveStatus === LoadingStatus.SUCCESSFUL}
                    icon={saveButtonIcon}
                    onPress={save}
                >
                    {overallSaveStatus === LoadingStatus.ERROR ? 'Retry failed transactions' : 'Save'}
                </Button>
            </View>
        </View>
    );
};
