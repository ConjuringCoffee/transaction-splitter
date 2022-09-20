import React, { useCallback, useLayoutEffect, useState } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { useAppSelector } from '../../redux/hooks';
import { selectAllProfiles } from '../../redux/features/profiles/profilesSlice';
import { selectAccountById, selectActiveAccounts, selectBudgetById } from '../../redux/features/ynab/ynabSlice';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { TotalAmountInput } from '../../Component/TotalAmountInput';
import { DatePickerInput } from 'react-native-paper-dates';
import { AccountRadioSelection } from './AccountRadioSelection';
import { PayerProfileRadioSelection } from './PayerProfileRadioSelection';

type ScreenName = 'Split Transaction';

const SCREEN_TITLE = 'Transaction Splitter';
const ICON_SETTINGS = 'cog';

export const SplittingScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profiles = useAppSelector(selectAllProfiles);

    const [payerProfileIndex, setPayerProfileIndex] = useState<number>(0);
    const [payeeName, setPayeeName] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [memo, setMemo] = useState<string>('[Generated]');

    const payerProfile = profiles[payerProfileIndex];
    const debtorProfile = profiles[1 - payerProfileIndex];

    const payerBudget = useAppSelector((state) => selectBudgetById(state, payerProfile.budgetId));
    const [payerAccountID, setPayerAccountID] = useState<string>(payerBudget.accounts[0].id);
    const payerTransferAccount = useAppSelector((state) => selectAccountById(state, payerProfile.budgetId, payerProfile.debtorAccountId));

    const activeOnBudgetAccounts = useAppSelector((state) => selectActiveAccounts(state, payerProfile.budgetId));
    const elegibleAccounts = activeOnBudgetAccounts.filter((account) => payerProfile.elegibleAccountIds.find((id) => id === account.id));

    const everythingSelected = totalAmount > 0;

    const navigateToSettingsScreen = useCallback(() => {
        navigation.navigate(ScreenNames.SETTINGS_OVERVIEW_SCREEN);
    }, [navigation]);

    const navigationBar = useCallback(() => (
        <NavigationBar
            title={SCREEN_TITLE}
            navigation={navigation}
            additions={
                <Appbar.Action
                    onPress={navigateToSettingsScreen}
                    icon={ICON_SETTINGS} />
            }
        />
    ), [navigation, navigateToSettingsScreen]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: navigationBar,
        });
    }, [navigation, navigationBar]);

    const navigateToAmountsScreen = () => {
        navigation.navigate(
            ScreenNames.AMOUNTS_SCREEN,
            {
                basicData: {
                    payer: {
                        budgetId: payerProfile.budgetId,
                        accountId: payerAccountID,
                        transferAccountId: payerProfile.debtorAccountId,
                        transferAccountPayeeId: payerTransferAccount.transferPayeeID,
                    },
                    debtor: {
                        budgetId: debtorProfile.budgetId,
                        accountId: debtorProfile.debtorAccountId,
                    },
                    payeeName,
                    date: toIsoDateString(date),
                    memo,
                    totalAmount,
                },
            },
        );
    };

    return (
        <CustomScrollView>
            <TotalAmountInput
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
            />
            <PayerProfileRadioSelection
                profiles={profiles}
                payerProfileIndex={payerProfileIndex}
                setPayerProfileIndex={setPayerProfileIndex}
            />
            <AccountRadioSelection
                accounts={elegibleAccounts}
                selectedAccountId={payerAccountID}
                setSelectedAccountId={setPayerAccountID}
            />
            <TextInput
                label='Payee'
                value={payeeName}
                onChangeText={setPayeeName}
            />
            <DatePickerInput
                // All locales used must be registered beforehand (see App.tsx)
                locale="de"
                label="Date"
                value={date}
                onChange={(date) => {
                    if (date) {
                        setDate(date);
                    }
                }}
                inputMode="start"
            />
            <TextInput
                label='Memo'
                value={memo}
                onChangeText={setMemo}
            />
            <Button
                disabled={!everythingSelected}
                onPress={navigateToAmountsScreen}>
                Continue
            </Button>
        </CustomScrollView>
    );
};

const toIsoDateString = (date: Date): string => {
    // Stolen from here: https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
    const pad = (num: number) => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
