import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Account } from '../../YnabApi/YnabApiWrapper';
import { BudgetInProfile, selectProfile } from '../../redux/features/profile/profileSlice';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { Appbar, Button, Surface, Text, TextInput } from 'react-native-paper';
import { useTheme } from '../../Hooks/useTheme';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { InitialFetchStatus, useInitialFetchStatus } from '../../Hooks/useInitialFetchStatus';
import { fetchCategoryGroups, selectAccountById, selectActiveAccounts, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
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

const getPreselectedAccountForBudget = (budgetInProfile: BudgetInProfile, activeAccounts: Account[]): string => {
    const eligible = activeAccounts.filter((a) => budgetInProfile.elegibleAccountIds.includes(a.id));
    const defaultId = budgetInProfile.defaultEligibleAccountId;
    if (defaultId && eligible.some((a) => a.id === defaultId)) {
        return defaultId;
    }
    return eligible[0]?.id ?? '';
};

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

    const payerBudgetInProfile = profile.budgets[payerBudgetIndex];
    const debtorBudgetInProfile = profile.budgets[1 - payerBudgetIndex];

    const payerTransferAccount = useAppSelector((state) => selectAccountById(state, payerBudgetInProfile.budgetId, payerBudgetInProfile.debtorAccountId));

    const activeAccountsBudget0 = useAppSelector((state) => selectActiveAccounts(state, profile.budgets[0].budgetId));
    const activeAccountsBudget1 = useAppSelector((state) => selectActiveAccounts(state, profile.budgets[1].budgetId));
    const elegibleAccounts = (payerBudgetIndex === 0 ? activeAccountsBudget0 : activeAccountsBudget1)
        .filter((account) => payerBudgetInProfile.elegibleAccountIds.includes(account.id));

    const [payerAccountID, setPayerAccountID] = useState<string>(
        () => getPreselectedAccountForBudget(profile.budgets[0], activeAccountsBudget0),
    );

    const handlePayerBudgetChange = useCallback((newIndex: number) => {
        const activeAccounts = newIndex === 0 ? activeAccountsBudget0 : activeAccountsBudget1;
        setPayerBudgetIndex(newIndex);
        setPayerAccountID(getPreselectedAccountForBudget(profile.budgets[newIndex], activeAccounts));
    }, [profile, activeAccountsBudget0, activeAccountsBudget1]);

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
                dispatch(fetchCategoryGroups({ accessToken, budgetId: payerBudgetInProfile.budgetId }));
            }
        },
        [payerCategoriesFetchStatus, accessToken, payerBudgetInProfile.budgetId, dispatch],
    );

    useEffect(
        () => {
            if (debtorCategoriesFetchStatus === LoadingStatus.IDLE) {
                dispatch(fetchCategoryGroups({ accessToken, budgetId: debtorBudgetInProfile.budgetId }));
            }
        },
        [debtorCategoriesFetchStatus, accessToken, debtorBudgetInProfile.budgetId, dispatch],
    );

    const [theme] = useTheme();
    const cardStyle = useMemo(() => ({ padding: theme.cardPadding, gap: theme.cardPadding, borderRadius: theme.roundness * 3 }), [theme]);

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
                iconColor={theme.colors.onPrimary}
            />
        ),
        [navigateToSettingsScreen, theme.colors.onPrimary],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const navigateToAmountsScreen = useCallback(
        (): void => {
            // Trigger fetches again if they failed before
            if (payerCategoriesFetchStatus === LoadingStatus.ERROR) {
                dispatch(fetchCategoryGroups({ accessToken, budgetId: payerBudgetInProfile.budgetId }));
            }
            if (debtorCategoriesFetchStatus === LoadingStatus.ERROR) {
                dispatch(fetchCategoryGroups({ accessToken, budgetId: debtorBudgetInProfile.budgetId }));
            }
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
            accessToken, date, debtorBudgetInProfile.budgetId, debtorBudgetInProfile.debtorAccountId,
            debtorCategoriesFetchStatus, dispatch, memo, navigation, payeeName, payerAccountID,
            payerBudgetInProfile.budgetId, payerBudgetInProfile.debtorAccountId,
            payerCategoriesFetchStatus, payerTransferAccount.transferPayeeID, totalAmount,
        ],
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
                        <Text variant='titleMedium'>Payer</Text>
                        <PayerBudgetSelection
                            payerBudgetIndex={payerBudgetIndex}
                            setPayerBudgetIndex={handlePayerBudgetChange}
                        />
                        <AccountSelection
                            accounts={elegibleAccounts}
                            selectedAccountId={payerAccountID}
                            setSelectedAccountId={setPayerAccountID}
                        />
                    </Surface>
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
                            onChange={(newDate) => {
                                if (newDate) {
                                    setDate(newDate);
                                }
                            }}
                            inputMode="start"
                        />
                        <TextInput
                            label='Memo'
                            mode='outlined'
                            value={memo}
                            onChangeText={setMemo}
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
