import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { Keyboard, View } from 'react-native';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { roundToTwoDecimalPlaces } from '../../Helper/AmountHelper';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { AmountEntry, buildSaveTransactions } from '../../YnabApi/BuildSaveTransactions';
import { AmountView } from './AmountView';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { Appbar, Button, Text } from 'react-native-paper';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import { useNavigationSettings } from '../../Hooks/useNavigationSettings';
import { useTheme } from '../../Hooks/useTheme';
import { isSplitPercentInvalid } from '../../Helper/SplitPercentHelper';

type ScreenName = 'Amounts';

export type UserInterfaceAmountEntry = {
    id: string,
    amountText: string,
    memo: string,
    payerCategoryId?: string,
    debtorCategoryId?: string,
    splitPercentToPayerText?: string
}

const SCREEN_TITLE = 'Enter amounts';

export const AmountsScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [quickModeEnabled, setQuickModeEnabled] = useState<boolean>(true);
    const [amountEntries, setAmountEntries] = useState<Array<UserInterfaceAmountEntry>>([]);
    const [convertTextToNumber, convertNumberToText] = useAmountConversion();
    const accessToken = useAppSelector(selectAccessToken);
    const [theme] = useTheme();

    const dispatch = useAppDispatch();

    const basicData = route.params.basicData;
    const payerBudgetId = basicData.payer.budgetId;
    const debtorBudgetId = basicData.debtor.budgetId;

    const payerCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, payerBudgetId));
    const debtorCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, debtorBudgetId));

    useEffect(
        () => {
            if (payerCategoriesFetchStatus === LoadingStatus.IDLE) {
                dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: payerBudgetId }));
            }
        },
        [payerCategoriesFetchStatus, dispatch, payerBudgetId, accessToken],
    );

    useEffect(
        () => {
            if (debtorCategoriesFetchStatus === LoadingStatus.IDLE) {
                dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: debtorBudgetId }));
            }
        },
        [debtorCategoriesFetchStatus, dispatch, debtorBudgetId, accessToken],
    );

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={quickModeEnabled ? 'arrow-expand-vertical' : 'arrow-collapse-vertical'}
                iconColor={theme.colors.onPrimary}
                onPress={() => setQuickModeEnabled(!quickModeEnabled)}
            />
        ),
        [quickModeEnabled, theme],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const remainingAmount = useMemo(
        () => {
            let remainingAmount = basicData.totalAmount;

            amountEntries.forEach((amountEntry) => {
                const amount = convertTextToNumber(amountEntry.amountText);

                if (Number.isNaN(amount)) {
                    // Skip invalid amounts
                    return;
                }

                remainingAmount = roundToTwoDecimalPlaces(remainingAmount - amount);
            });

            return remainingAmount;
        },
        [basicData, amountEntries, convertTextToNumber],
    );

    const addAmountEntry = useCallback(
        (amountText: string) => {
            Keyboard.dismiss();
            setAmountEntries((prev) => [...prev, {
                id: nanoid(),
                amountText: amountText ?? '',
                memo: '',
            }]);
        },
        [],
    );

    const addEmptyAmountEntry = useCallback(
        () => addAmountEntry(''),
        [addAmountEntry],
    );

    const addRemainingAmountEntry = useCallback(
        () => addAmountEntry(convertNumberToText(remainingAmount)),
        [addAmountEntry, convertNumberToText, remainingAmount],
    );

    const updateAmountEntry = useCallback(
        (index: number, update: Partial<UserInterfaceAmountEntry>) => {
            setAmountEntries((prev) => prev.map((entry, i) =>
                i === index ? { ...entry, ...update } : entry,
            ));
        },
        [],
    );

    const removeAmountEntry = useCallback(
        (index: number) => {
            setAmountEntries((prev) => prev.filter((_, i) => i !== index));
        },
        [],
    );

    const okayToContinue = useMemo(
        () => {
            if (remainingAmount !== 0) {
                return false;
            }

            for (const amountEntry of amountEntries) {
                const amount = convertTextToNumber(amountEntry.amountText);
                const bothCategoriesChosen = amountEntry.payerCategoryId !== undefined && amountEntry.debtorCategoryId !== undefined;

                if (Number.isNaN(amount)
                    || amount === 0
                    || (amountEntry.payerCategoryId === undefined && amountEntry.debtorCategoryId === undefined)
                    || (bothCategoriesChosen && isSplitPercentInvalid(amountEntry.splitPercentToPayerText))) {
                    return false;
                }
            }

            return true;
        },
        [remainingAmount, amountEntries, convertTextToNumber],
    );

    const navigateToSaveScreen = useCallback(
        () => {
            const convertedAmountEntries: AmountEntry[] = [];

            amountEntries.forEach((amountEntry) => {
                convertedAmountEntries.push({
                    amount: convertTextToNumber(amountEntry.amountText),
                    debtorCategoryId: amountEntry.debtorCategoryId,
                    payerCategoryId: amountEntry.payerCategoryId,
                    splitPercentToPayer: amountEntry.splitPercentToPayerText !== undefined ? Number(amountEntry.splitPercentToPayerText) : undefined,
                    memo: amountEntry.memo,
                });
            });

            const saveTransactions = buildSaveTransactions(convertedAmountEntries, basicData);

            navigation.navigate(
                ScreenNames.SAVE_SCREEN,
                {
                    basicData: basicData,
                    payerSaveTransaction: saveTransactions.payer,
                    debtorSaveTransaction: saveTransactions.debtor,
                },
            );
        },
        [amountEntries, basicData, convertTextToNumber, navigation],
    );

    const addingDisabled = remainingAmount === 0;

    const categoriesAreLoaded
        = payerCategoriesFetchStatus === LoadingStatus.SUCCESSFUL
        && debtorCategoriesFetchStatus === LoadingStatus.SUCCESSFUL;

    return (
        <View style={{ flex: 1 }}>
            <CustomScrollView>
                {categoriesAreLoaded
                    ? (
                        <View style={{ gap: theme.spacing }}>
                            {amountEntries.map((amountEntry, index) => (
                                <AmountView
                                    key={amountEntry.id}
                                    amountEntry={amountEntry}
                                    payerBudgetId={basicData.payer.budgetId}
                                    debtorBudgetId={basicData.debtor.budgetId}
                                    updateAmountEntry={(changes) => updateAmountEntry(index, changes)}
                                    onRemovePress={() => removeAmountEntry(index)}
                                    navigation={navigation}
                                    quickModeEnabled={quickModeEnabled}
                                />
                            ))}
                        </View>
                    )
                    : <LoadingComponent />}
            </CustomScrollView>
            <View style={{ padding: theme.cardPadding, gap: theme.spacing }}>
                <Text variant='bodyMedium' style={{ textAlign: 'center' }}>
                    {`Remaining: ${convertNumberToText(remainingAmount)}€`}
                </Text>
                <View style={{ flexDirection: 'row', gap: theme.spacing }}>
                    <Button
                        disabled={addingDisabled}
                        mode='contained'
                        style={{ flex: 1 }}
                        onPress={addEmptyAmountEntry}
                    >
                        Add
                    </Button>
                    <Button
                        disabled={addingDisabled}
                        mode='contained'
                        style={{ flex: 1 }}
                        onPress={addRemainingAmountEntry}
                    >
                        Add remaining
                    </Button>
                </View>
                <Button
                    disabled={!okayToContinue}
                    mode='contained'
                    onPress={navigateToSaveScreen}
                >
                    Continue
                </Button>
            </View>
        </View>
    );
};
