import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { useLocalization } from '../../Hooks/useLocalization';
import { convertAmountToText } from '../../Helper/AmountHelper';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { AmountEntry, buildSaveTransactions } from '../../YnabApi/BuildSaveTransactions';
import { AmountCard } from './AmountCard';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCategoryCombos, selectCategoryComboFetchStatus } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { fetchCategories, selectActiveCategories, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Amounts'>;
type MyRouteProp = RouteProp<StackParameterList, 'Amounts'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const AmountsScreen = (props: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [amountEntries, setAmountEntries] = useState<Array<AmountEntry>>([]);

    const dispatch = useAppDispatch();

    const fetchCategoryComboStatus = useAppSelector(selectCategoryComboFetchStatus);

    const basicData = props.route.params.basicData;
    const payerBudgetId = basicData.payer.budgetId;
    const debtorBudgetId = basicData.debtor.budgetId;

    const payerCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, payerBudgetId));
    const payerCategories = useAppSelector((state) => selectActiveCategories(state, payerBudgetId));

    const debtorCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, debtorBudgetId));
    const debtorCategories = useAppSelector((state) => selectActiveCategories(state, debtorBudgetId));


    useEffect(() => {
        if (fetchCategoryComboStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchCategoryCombos());
        }
    }, [fetchCategoryComboStatus, dispatch]);

    useEffect(() => {
        if (payerCategoriesFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategories(payerBudgetId));
        }
    }, [payerCategoriesFetchStatus, dispatch, payerBudgetId]);

    useEffect(() => {
        if (debtorCategoriesFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategories(debtorBudgetId));
        }
    }, [debtorCategoriesFetchStatus, dispatch, debtorBudgetId]);

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
            {categoriesAreLoaded && numberFormatSettings && fetchCategoryComboStatus.status === LoadingStatus.SUCCESSFUL
                ? <Layout>
                    {amountEntries.map((amountEntry, index) => {
                        return <AmountCard
                            key={index}
                            index={index}
                            numberFormatSettings={numberFormatSettings}
                            amount={amountEntry.amount}
                            payerBudgetId={basicData.payer.budgetId}
                            debtorBudgetId={basicData.debtor.budgetId}
                            setAmount={(amount) => setAmount(index, amount)}
                            setMemo={(memo) => setMemo(index, memo)}
                            payerCategories={payerCategories}
                            payerCategoryId={amountEntry.payerCategoryId}
                            setPayerCategoryId={(categoryId) => setPayerCategoryId(index, categoryId)}
                            debtorCategories={debtorCategories}
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
                                if (payerCategories === undefined || debtorCategories === undefined) {
                                    throw new Error('This is a programming error');
                                }

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
