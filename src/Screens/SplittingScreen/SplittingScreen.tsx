import React, { useCallback, useMemo, useState } from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectProfiles } from '../../redux/features/profiles/profilesSlice';
import { selectAccountById, selectActiveAccounts, selectBudgetById } from '../../redux/features/ynab/ynabSlice';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { TotalAmountInput } from './TotalAmountInput';
import { DatePickerInput } from 'react-native-paper-dates';
import { AccountRadioSelection } from './AccountRadioSelection';
import { PayerBudgetRadioSelection } from './PayerBudgetRadioSelection';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useNavigationBar } from '../../Hooks/useNavigationBar';

type ScreenName = 'Split Transaction';

const SCREEN_TITLE = 'Transaction Splitter';
const ICON_SETTINGS = 'cog';

export const SplittingScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profiles = useAppSelector(selectProfiles);
    const [convertTextToNumber] = useAmountConversion();

    // TODO: Support switching profiles
    const profileUsed = profiles[0];

    const [payerBudgetIndex, setPayerBudgetIndex] = useState<number>(0);
    const [payeeName, setPayeeName] = useState<string>('');
    const [totalAmountText, setTotalAmountText] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [memo, setMemo] = useState<string>('[Generated]');

    const payerBudgetInProfile = profileUsed.budgets[payerBudgetIndex];
    const debtorBudgetInProfile = profileUsed.budgets[1 - payerBudgetIndex];

    const payerBudget = useAppSelector((state) => selectBudgetById(state, payerBudgetInProfile.budgetId));
    const [payerAccountID, setPayerAccountID] = useState<string>(payerBudget.accounts[0].id);
    const payerTransferAccount = useAppSelector((state) => selectAccountById(state, payerBudgetInProfile.budgetId, payerBudgetInProfile.debtorAccountId));

    const activeOnBudgetAccounts = useAppSelector((state) => selectActiveAccounts(state, payerBudgetInProfile.budgetId));
    const elegibleAccounts = activeOnBudgetAccounts.filter((account) => payerBudgetInProfile.elegibleAccountIds.find((id) => id === account.id));

    const totalAmount = useMemo(
        () => convertTextToNumber(totalAmountText),
        [totalAmountText, convertTextToNumber],
    );

    const everythingSelected = totalAmount > 0;

    const navigateToSettingsScreen = useCallback(() => {
        navigation.navigate(ScreenNames.SETTINGS_OVERVIEW_SCREEN);
    }, [navigation]);

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                onPress={navigateToSettingsScreen}
                icon={ICON_SETTINGS}
            />
        ),
        [navigateToSettingsScreen],
    );

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const navigateToAmountsScreen = () => {
        navigation.navigate(
            ScreenNames.AMOUNTS_SCREEN,
            {
                basicData: {
                    payer: {
                        budgetId: payerBudgetInProfile.budgetId,
                        accountId: payerAccountID,
                        transferAccountId: payerBudgetInProfile.debtorAccountId,
                        transferAccountPayeeId: payerTransferAccount.transferPayeeID,
                    },
                    debtor: {
                        budgetId: debtorBudgetInProfile.budgetId,
                        accountId: debtorBudgetInProfile.debtorAccountId,
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
                value={totalAmountText}
                setValue={setTotalAmountText}
            />
            <TextInput
                label='Payee'
                value={payeeName}
                onChangeText={setPayeeName}
            />
            <TextInput
                label='Memo'
                value={memo}
                onChangeText={setMemo}
            />
            <PayerBudgetRadioSelection
                profile={profileUsed}
                payerBudgetIndex={payerBudgetIndex}
                setPayerBudgetIndex={setPayerBudgetIndex}
            />
            <AccountRadioSelection
                accounts={elegibleAccounts}
                selectedAccountId={payerAccountID}
                setSelectedAccountId={setPayerAccountID}
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
            <Button
                disabled={!everythingSelected}
                onPress={navigateToAmountsScreen}
            >
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
