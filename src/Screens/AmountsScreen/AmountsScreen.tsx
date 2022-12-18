import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
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
import { Button, Divider, Menu, Text } from 'react-native-paper';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import { AppBarMoreMenu } from '../../Component/AppBarMoreMenu';
import { useNavigationBar } from '../../Hooks/useNavigationBar';

type ScreenName = 'Amounts';

interface UserInterfaceAmountEntry {
    amountText: string,
    memo: string,
    payerCategoryId?: string,
    debtorCategoryId?: string,
    splitPercentToPayer?: number
}

const SCREEN_TITLE = 'Enter amounts';

export const AmountsScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
    const [quickModeEnabled, setQuickModeEnabled] = useState<boolean>(true);
    const [amountEntries, setAmountEntries] = useState<Array<UserInterfaceAmountEntry>>([]);
    const [convertTextToNumber, convertNumberToText] = useAmountConversion();
    const accessToken = useAppSelector(selectAccessToken);

    const dispatch = useAppDispatch();

    const basicData = route.params.basicData;
    const payerBudgetId = basicData.payer.budgetId;
    const debtorBudgetId = basicData.debtor.budgetId;

    // TODO: Load these earlier
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

    const toggleQuickModeAndCloseMenu = useCallback(
        () => {
            setQuickModeEnabled(!quickModeEnabled);
            setMenuVisible(!menuVisible);
        },
        [setQuickModeEnabled, setMenuVisible, quickModeEnabled, menuVisible],
    );

    const navigationBarAddition = useMemo(
        () => {
            const title = quickModeEnabled ? 'Disable Quick Mode' : 'Enable Quick Mode';

            return (
                <AppBarMoreMenu
                    key='more'
                    visible={menuVisible}
                    setVisible={setMenuVisible}
                >
                    <Menu.Item
                        title={title}
                        onPress={toggleQuickModeAndCloseMenu}
                    />
                </AppBarMoreMenu>);
        },
        [toggleQuickModeAndCloseMenu, menuVisible, quickModeEnabled],
    );

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

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

    const addAmountEntry = useCallback(
        (amountText: string) => {
            Keyboard.dismiss();
            const entries = [...amountEntries, {
                amountText: amountText ?? '',
                memo: '',

            }];
            setAmountEntries(entries);
        },
        [amountEntries],
    );

    const addEmptyAmountEntry = useCallback(
        () => addAmountEntry(''),
        [addAmountEntry],
    );

    const addRemainingAmountEntry = useCallback(
        () => addAmountEntry(convertNumberToText(remainingAmount)),
        [addAmountEntry, convertNumberToText, remainingAmount],
    );

    const setAmountText = useCallback(
        (index: number, amountText: string) => {
            const entries = [...amountEntries];
            entries[index].amountText = amountText;
            setAmountEntries(entries);
        },
        [amountEntries],
    );

    const setMemo = useCallback(
        (index: number, memo: string) => {
            const entries = [...amountEntries];
            entries[index].memo = memo;
            setAmountEntries(entries);
        },
        [amountEntries],
    );

    const setPayerCategoryId = useCallback(
        (index: number, id: string | undefined) => {
            const entries = [...amountEntries];
            entries[index].payerCategoryId = id;
            setAmountEntries(entries);
        },
        [amountEntries],
    );

    const setDebtorCategoryId = useCallback(
        (index: number, id: string | undefined) => {
            const entries = [...amountEntries];
            entries[index].debtorCategoryId = id;
            setAmountEntries(entries);
        },
        [amountEntries],
    );

    const setSplitPercentToPayer = useCallback((index: number, splitPercent: number | undefined) => {
        const entries = [...amountEntries];
        entries[index].splitPercentToPayer = splitPercent;
        setAmountEntries(entries);
    }, [amountEntries]);

    const removeAmountEntry = useCallback(
        (index: number) => {
            const entries = [...amountEntries];
            entries.splice(index, 1);
            setAmountEntries(entries);
        },
        [amountEntries],
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

    const navigateToSaveScreen = useCallback(
        () => {
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
        <CustomScrollView>
            {categoriesAreLoaded
                ? (
                    <View style={styles.view}>
                        {amountEntries.map((amountEntry, index) => {
                            return (
                                <AmountView
                                    key={index}
                                    index={index}
                                    amountText={amountEntry.amountText}
                                    payerBudgetId={basicData.payer.budgetId}
                                    debtorBudgetId={basicData.debtor.budgetId}
                                    setAmountText={setAmountText}
                                    setMemo={setMemo}
                                    payerCategoryId={amountEntry.payerCategoryId}
                                    setPayerCategoryId={setPayerCategoryId}
                                    debtorCategoryId={amountEntry.debtorCategoryId}
                                    setDebtorCategoryId={setDebtorCategoryId}
                                    splitPercentToPayer={amountEntry.splitPercentToPayer}
                                    setSplitPercentToPayer={setSplitPercentToPayer}
                                    onRemovePress={removeAmountEntry}
                                    navigation={navigation}
                                    quickModeEnabled={quickModeEnabled}
                                />
                            );
                        })}

                        <Button
                            disabled={addingDisabled}
                            mode='contained'
                            style={styles.button}
                            onPress={addEmptyAmountEntry}
                        >
                            Add
                        </Button>
                        <Button
                            disabled={addingDisabled}
                            mode='contained'
                            style={styles.button}
                            onPress={addRemainingAmountEntry}
                        >
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
                            onPress={navigateToSaveScreen}
                        >
                            Continue
                        </Button>
                    </View>
                )
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
