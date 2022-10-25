import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { roundToTwoDecimalPlaces } from '../../Helper/AmountHelper';
import { StackParameterList } from '../../Navigation/ScreenParameters';
import { AmountEntry, buildSaveTransactions } from '../../YnabApi/BuildSaveTransactions';
import { AmountView } from './AmountView';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { Button, Divider, Text } from 'react-native-paper';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useAppDispatch } from '../../Hooks/useAppDispatch';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Amounts'>;
type MyRouteProp = RouteProp<StackParameterList, 'Amounts'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface UserInterfaceAmountEntry {
    amountText: string,
    memo: string,
    payerCategoryId?: string,
    debtorCategoryId?: string,
    splitPercentToPayer?: number
}

export const AmountsScreen = (props: Props) => {
    const [amountEntries, setAmountEntries] = useState<Array<UserInterfaceAmountEntry>>([]);
    const [convertTextToNumber, convertNumberToText] = useAmountConversion();
    const accessToken = useAppSelector(selectAccessToken);

    const dispatch = useAppDispatch();

    const basicData = props.route.params.basicData;
    const payerBudgetId = basicData.payer.budgetId;
    const debtorBudgetId = basicData.debtor.budgetId;

    // TODO: Load these earlier
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

    const addAmountEntry = (amountText: string) => {
        const entries = [...amountEntries, {
            amountText: amountText ?? '',
            memo: '',

        }];
        setAmountEntries(entries);
    };

    const setAmountText = (index: number, amountText: string) => {
        const entries = [...amountEntries];
        entries[index].amountText = amountText;
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

    const remainingAmount = useMemo(
        () => {
            let remainingAmount = basicData.totalAmount;

            amountEntries.forEach((amountEntry) => {
                const amount = convertTextToNumber(amountEntry.amountText);

                if (isNaN(amount)) {
                    // Skip invalid amounts
                    return;
                }

                remainingAmount = roundToTwoDecimalPlaces(remainingAmount - amount);
            });

            return remainingAmount;
        },
        [basicData, amountEntries, convertTextToNumber],
    );

    const okayToContinue = useMemo(
        () => {
            if (remainingAmount !== 0) {
                return false;
            }

            for (const amountEntry of amountEntries) {
                const amount = convertTextToNumber(amountEntry.amountText);

                if (isNaN(amount)
                    || amount === 0
                    || (amountEntry.payerCategoryId === undefined && amountEntry.debtorCategoryId === undefined)) {
                    return false;
                }
            }

            return true;
        },
        [remainingAmount, amountEntries, convertTextToNumber],
    );

    const addingDisabled = remainingAmount === 0;

    const categoriesAreLoaded
        = payerCategoriesFetchStatus === LoadingStatus.SUCCESSFUL
        && debtorCategoriesFetchStatus === LoadingStatus.SUCCESSFUL;

    return (
        <CustomScrollView>
            {categoriesAreLoaded
                ? <View style={styles.view}>
                    {amountEntries.map((amountEntry, index) => {
                        return (
                            <AmountView
                                key={index}
                                index={index}
                                amountText={amountEntry.amountText}
                                payerBudgetId={basicData.payer.budgetId}
                                debtorBudgetId={basicData.debtor.budgetId}
                                setAmountText={(amount) => setAmountText(index, amount)}
                                setMemo={(memo) => setMemo(index, memo)}
                                payerCategoryId={amountEntry.payerCategoryId}
                                setPayerCategoryId={(categoryId) => setPayerCategoryId(index, categoryId)}
                                debtorCategoryId={amountEntry.debtorCategoryId}
                                setDebtorCategoryId={(categoryId) => setDebtorCategoryId(index, categoryId)}
                                splitPercentToPayer={amountEntry.splitPercentToPayer}
                                setSplitPercentToPayer={setSplitPercentToPayer}
                                onRemovePress={() => removeAmountEntry(index)}
                                navigation={props.navigation} />
                        );
                    })}

                    <Button
                        disabled={addingDisabled}
                        mode='contained'
                        style={styles.button}
                        onPress={() => {
                            addAmountEntry('');
                            Keyboard.dismiss();
                        }}>
                        Add
                    </Button>
                    <Button
                        disabled={addingDisabled}
                        mode='contained'
                        style={styles.button}
                        onPress={() => {
                            addAmountEntry(convertNumberToText(remainingAmount));
                            Keyboard.dismiss();
                        }}>
                        Add remaining
                    </Button>

                    <Divider />

                    <Text>
                        {`Remaining amount: ${convertNumberToText(remainingAmount)}€`}
                    </Text>

                    <Button
                        disabled={!okayToContinue}
                        mode='contained'
                        style={styles.button}
                        onPress={() => {
                            const convertedAmountEntries: AmountEntry[] = [];

                            amountEntries.forEach((amountEntry) => {
                                convertedAmountEntries.push({
                                    amount: convertTextToNumber(amountEntry.amountText),
                                    debtorCategoryId: amountEntry.debtorCategoryId,
                                    payerCategoryId: amountEntry.payerCategoryId,
                                    splitPercentToPayer: amountEntry.splitPercentToPayer,
                                    memo: amountEntry.memo,
                                });
                            });

                            const saveTransactions = buildSaveTransactions(convertedAmountEntries, basicData);

                            props.navigation.navigate(
                                ScreenNames.SAVE_SCREEN,
                                {
                                    basicData: basicData,
                                    payerSaveTransaction: saveTransactions.payer,
                                    debtorSaveTransaction: saveTransactions.debtor,
                                },
                            );
                        }}
                    >
                        Continue
                    </Button>
                </View>
                : <LoadingComponent />}
        </CustomScrollView>);
};

const styles = StyleSheet.create({
    view: {
        marginHorizontal: 10,
    },
    button: {
        marginVertical: 5,
    },
});
