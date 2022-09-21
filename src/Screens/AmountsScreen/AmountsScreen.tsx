import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { convertAmountToText } from '../../Helper/AmountHelper';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { AmountEntry, buildSaveTransactions } from '../../YnabApi/BuildSaveTransactions';
import { AmountCard } from './AmountCard';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Amounts'>;
type MyRouteProp = RouteProp<StackParameterList, 'Amounts'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const AmountsScreen = (props: Props) => {
    const [amountEntries, setAmountEntries] = useState<Array<AmountEntry>>([]);
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);
    const accessToken = useAppSelector(selectAccessToken);

    const dispatch = useAppDispatch();

    const basicData = props.route.params.basicData;
    const payerBudgetId = basicData.payer.budgetId;
    const debtorBudgetId = basicData.debtor.budgetId;

    const payerCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, payerBudgetId));
    const debtorCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, debtorBudgetId));

    useEffect(() => {
        if (payerCategoriesFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: payerBudgetId }));
        }
    }, [payerCategoriesFetchStatus, dispatch, payerBudgetId, accessToken]);

    useEffect(() => {
        if (debtorCategoriesFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: debtorBudgetId }));
        }
    }, [debtorCategoriesFetchStatus, dispatch, debtorBudgetId, accessToken]);

    const addAmountEntry = (amount?: number) => {
        const entries = [...amountEntries, {
            amount: amount || 0,
            memo: '',

        }];
        setAmountEntries(entries);
    };

    const setAmount = (index: number, amount: number) => {
        const entries = [...amountEntries];
        entries[index].amount = amount;
        setAmountEntries(entries);
    };

    const setMemo = (index: number, memo: string) => {
        const entries = [...amountEntries];
        entries[index].memo = memo;
        setAmountEntries(entries);
    };

    const setPayerCategoryId = (index: number, id: string | undefined) => {
        const entries = [...amountEntries];
        entries[index].payerCategoryId = id;
        setAmountEntries(entries);
    };

    const setDebtorCategoryId = (index: number, id: string | undefined) => {
        const entries = [...amountEntries];
        entries[index].debtorCategoryId = id;
        setAmountEntries(entries);
    };

    const setSplitPercentToPayer = useCallback((index: number, splitPercent: number | undefined) => {
        const entries = [...amountEntries];
        entries[index].splitPercentToPayer = splitPercent;
        setAmountEntries(entries);
    }, [amountEntries]);

    const removeAmountEntry = (index: number) => {
        const entries = [...amountEntries];
        entries.splice(index, 1);
        setAmountEntries(entries);
    };

    const calculateRemainingAmount = (totalAmount: number) => {
        let amount = totalAmount;

        amountEntries.forEach((amountEntry) => {
            amount = Math.round(((amount - amountEntry.amount) + Number.EPSILON) * 100) / 100;
        });

        return amount;
    };

    const isOkayToContinue = (amountRemaining: number) => {
        let notOkay = amountRemaining !== 0;

        amountEntries.forEach((amountEntry) => {
            if (amountEntry.amount === 0
                || (amountEntry.payerCategoryId === undefined && amountEntry.debtorCategoryId === undefined)) {
                notOkay = true;
            }
        });

        return !notOkay;
    };

    const remainingAmount = calculateRemainingAmount(basicData.totalAmount);
    const okayToContinue = isOkayToContinue(remainingAmount);
    const addingDisabled = remainingAmount === 0;

    const categoriesAreLoaded
        = payerCategoriesFetchStatus === LoadingStatus.SUCCESSFUL
        && debtorCategoriesFetchStatus === LoadingStatus.SUCCESSFUL;

    return (
        <CustomScrollView>
            {categoriesAreLoaded
                ? <Layout>
                    {amountEntries.map((amountEntry, index) => {
                        return <AmountCard
                            key={index}
                            index={index}
                            amount={amountEntry.amount}
                            payerBudgetId={basicData.payer.budgetId}
                            debtorBudgetId={basicData.debtor.budgetId}
                            setAmount={(amount) => setAmount(index, amount)}
                            setMemo={(memo) => setMemo(index, memo)}
                            payerCategoryId={amountEntry.payerCategoryId}
                            setPayerCategoryId={(categoryId) => setPayerCategoryId(index, categoryId)}
                            debtorCategoryId={amountEntry.debtorCategoryId}
                            setDebtorCategoryId={(categoryId) => setDebtorCategoryId(index, categoryId)}
                            splitPercentToPayer={amountEntry.splitPercentToPayer}
                            setSplitPercentToPayer={setSplitPercentToPayer}
                            onRemovePress={() => removeAmountEntry(index)}
                            navigation={props.navigation} />;
                    })}
                    <Card>
                        <Button
                            disabled={addingDisabled}
                            onPress={() => {
                                addAmountEntry();
                                Keyboard.dismiss();
                            }}>
                            Add
                        </Button>
                        <Button
                            disabled={addingDisabled}
                            onPress={() => {
                                addAmountEntry(remainingAmount);
                                Keyboard.dismiss();
                            }}>
                            Add remaining
                        </Button>
                    </Card>

                    <Card>
                        <Text>
                            {`Remaining amount: ${convertAmountToText(remainingAmount, numberFormatSettings)}€`}
                        </Text>

                        <Button
                            disabled={!okayToContinue}
                            onPress={() => {
                                const saveTransactions = buildSaveTransactions(amountEntries, basicData);

                                props.navigation.navigate(
                                    ScreenNames.SAVE_SCREEN,
                                    {
                                        basicData: basicData,
                                        payerSaveTransaction: saveTransactions.payer,
                                        debtorSaveTransaction: saveTransactions.debtor,
                                    },
                                );
                            }}>
                            Continue
                        </Button>
                    </Card>
                </Layout>
                : <LoadingComponent />}
        </CustomScrollView>);
};

export type { MyNavigationProp as Navigation };
