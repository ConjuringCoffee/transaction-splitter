import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { Appbar, Button, Surface, Text, TextInput } from 'react-native-paper';
import { useTheme } from '../../Hooks/useTheme';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectProfile } from '../../redux/features/profile/profileSlice';
import { InitialFetchStatus, useInitialFetchStatus } from '../../Hooks/useInitialFetchStatus';
import { fetchCategoryGroups, selectAccountById, selectActiveAccounts, selectBudgetById, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { CustomScrollView } from '../../Component/CustomScrollView';
import { TotalAmountInput } from './TotalAmountInput';
import { DatePickerInput } from 'react-native-paper-dates';
import { AccountSelection } from './AccountSelection';
import { PayerBudgetSelection } from './PayerBudgetSelection';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { useNavigationSettings } from '../../Hooks/useNavigationSettings';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import { View } from 'react-native';

type ScreenName = 'Split Transaction';

const SCREEN_TITLE = 'Transaction Splitter';
const ICON_SETTINGS = 'cog';

// Split into outer + inner component so the guard can precede all hooks in SplittingScreenContent.
export const SplittingScreen = ({ navigation, route }: MyStackScreenProps<ScreenName>) => {
    const [initialFetchStatus] = useInitialFetchStatus();

    useEffect(() => {
        if (initialFetchStatus === InitialFetchStatus.SETUP_REQUIRED) {
            navigation.reset({ index: 0, routes: [{ name: ScreenNames.INITIAL_SCREEN }] });
        }
    }, [initialFetchStatus, navigation]);

    if (initialFetchStatus !== InitialFetchStatus.READY) {
        return null;
    }

    return <SplittingScreenContent navigation={navigation} route={route} />;
};

const SplittingScreenContent = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profile = useAppSelector(selectProfile)!;
    const [convertTextToNumber] = useAmountConversion();

    const [payerBudgetIndex, setPayerBudgetIndex] = useState<number>(0);
    const [payeeName, setPayeeName] = useState<string>('');
    const [totalAmountText, setTotalAmountText] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [memo, setMemo] = useState<string>('[Generated]');

    const payerBudgetInProfile = useMemo(
        () => profile.budgets[payerBudgetIndex],
        [profile, payerBudgetIndex],
    );

    const debtorBudgetInProfile = useMemo(
        () => profile.budgets[1 - payerBudgetIndex],
        [profile, payerBudgetIndex],
    );

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

    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(selectAccessToken);
    const payerCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, payerBudgetInProfile.budgetId));
    const debtorCategoriesFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, debtorBudgetInProfile.budgetId));

    // Categories are not needed on this screen, but already initiating the fetch saves time on the next screen
    useEffect(
        () => {
            if (payerCategoriesFetchStatus === LoadingStatus.IDLE) {
                dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: payerBudgetInProfile.budgetId }));
            }
        },
        [payerCategoriesFetchStatus, accessToken, payerBudgetInProfile, dispatch],
    );

    useEffect(
        () => {
            if (debtorCategoriesFetchStatus === LoadingStatus.IDLE) {
                dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: debtorBudgetInProfile.budgetId }));
            }
        },
        [debtorCategoriesFetchStatus, accessToken, debtorBudgetInProfile, dispatch],
    );

    const [theme] = useTheme();
    const cardStyle = useMemo(() => ({ padding: theme.cardPadding, gap: theme.cardPadding }), [theme]);

    const navigateToSettingsScreen = useCallback(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: ScreenNames.SETTINGS_OVERVIEW_SCREEN }],
        });
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

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const navigateToAmountsScreen = useCallback(
        (): void => {
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
        },
        [
            date, debtorBudgetInProfile.budgetId, debtorBudgetInProfile.debtorAccountId,
            memo, navigation, payeeName, payerAccountID, payerBudgetInProfile.budgetId,
            payerBudgetInProfile.debtorAccountId, payerTransferAccount.transferPayeeID, totalAmount,
        ],
    );

    const setDateIfProvided = useCallback(
        (date: Date | undefined) => {
            if (date) {
                setDate(date);
            }
        },
        [],
    );

    return (
        <View style={{ flex: 1 }}>
            <TotalAmountInput
                value={totalAmountText}
                setValue={setTotalAmountText}
            />
            <CustomScrollView>
                <View style={{ gap: theme.spacing }}>
                    <Surface
                        elevation={1}
                        style={cardStyle}
                    >
                        <Text variant='titleMedium'>Details</Text>
                        <TextInput
                            label='Payee'
                            mode='outlined'
                            value={payeeName}
                            onChangeText={setPayeeName}
                        />
                        <DatePickerInput
                            locale="de"
                            label="Date"
                            mode='outlined'
                            value={date}
                            onChange={setDateIfProvided}
                            inputMode="start"
                        />
                        <TextInput
                            label='Memo'
                            mode='outlined'
                            value={memo}
                            onChangeText={setMemo}
                        />
                    </Surface>
                    <Surface
                        elevation={1}
                        style={cardStyle}
                    >
                        <Text variant='titleMedium'>Payer</Text>
                        <PayerBudgetSelection
                            payerBudgetIndex={payerBudgetIndex}
                            setPayerBudgetIndex={setPayerBudgetIndex}
                        />
                        <AccountSelection
                            accounts={elegibleAccounts}
                            selectedAccountId={payerAccountID}
                            setSelectedAccountId={setPayerAccountID}
                        />
                    </Surface>
                </View>
            </CustomScrollView>
            <View style={{ padding: theme.cardPadding }}>
                <Button
                    disabled={!everythingSelected}
                    onPress={navigateToAmountsScreen}
                    mode='contained'
                >
                    Continue
                </Button>
            </View>
        </View>
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
