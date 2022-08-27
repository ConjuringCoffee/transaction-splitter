import React, { useState } from "react";
import CustomScrollView from "../../Component/CustomScrollView";
import NumberInput from "../../Component/NumberInput";
import { NumberFormatSettings } from "../../Hooks/useLocalization";
import { StyleSheet } from 'react-native';
import { Profile } from "../../Repository/ProfileRepository";
import { Account, Budget } from "../../YnabApi/YnabApiWrapper";
import { Button, Card, Layout, Radio, RadioGroup } from "@ui-kitten/components";
import PayerAccountSelectionCard from "./PayerAccountSelectionCard";
import GeneralSelectionCard from "./GeneralSelectionCard";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SplittingScreenStackParameterList } from "../../Helper/Navigation/ScreenParameters";
import { nameAmountsScreen } from "../../Helper/Navigation/ScreenNames";
import BudgetsHelper from "../../Helper/BudgetsHelper";
import BudgetHelper from "../../Helper/BudgetHelper";

interface Props {
    navigation: DrawerNavigationProp<SplittingScreenStackParameterList>,
    numberFormatSettings: NumberFormatSettings,
    profiles: [Profile, Profile],
    budgets: Budget[],
}

const InitializedSplittingScreen = (props: Props) => {
    const [payerProfileIndex, setPayerProfileIndex] = useState<number>(0);
    const [payerAccountID, setPayerAccountID] = useState<string | undefined>(undefined);
    const [payeeName, setPayeeName] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [memo, setMemo] = useState<string>('[Generated]');

    const budgetsHelper = new BudgetsHelper(props.budgets);

    const getPayerProfile = (): Profile => {
        return props.profiles[payerProfileIndex];
    };

    const getDebtorProfile = (): Profile => {
        const debtorIndex = 1 - payerProfileIndex;
        return props.profiles[debtorIndex];
    };

    const getElegibleAccounts = (): Account[] => {
        const payerProfile = getPayerProfile();
        const payerBudget = budgetsHelper.getBudget(payerProfile.budgetId);

        const payerBudgetHelper = new BudgetHelper(payerBudget);
        const activeOnBudgetAccounts = payerBudgetHelper.getActiveOnBudgetAccounts();

        return activeOnBudgetAccounts.filter((account) => payerProfile.elegibleAccountIds.find((id) => id === account.id));
    }

    const everythingSelected = (
        payerAccountID !== undefined
        && totalAmount !== 0);

    const navigateToAmountsScreen = () => {
        const payerProfile = getPayerProfile();
        const payerBudget = budgetsHelper.getBudget(payerProfile.budgetId);

        const payerBudgetHelper = new BudgetHelper(payerBudget);
        const payerAccount = payerBudgetHelper.getAccount(payerAccountID);
        const payerTransferAccount = payerBudgetHelper.getAccount(payerProfile.debtorAccountId);

        const debtorProfile = getDebtorProfile();
        const debtorBudget = budgetsHelper.getBudget(debtorProfile.budgetId);
        const debtorBudgetHelper = new BudgetHelper(debtorBudget);
        const debtorAccount = debtorBudgetHelper.getAccount(debtorProfile.debtorAccountId);

        props.navigation.navigate(
            nameAmountsScreen,
            {
                basicData: {
                    payer: {
                        budget: payerBudget,
                        account: payerAccount,
                        transferAccount: payerTransferAccount,
                    },
                    debtor: {
                        budget: debtorBudget,
                        account: debtorAccount,
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
            <NumberInput
                numberFormatSettings={props.numberFormatSettings}
                number={totalAmount}
                setNumber={setTotalAmount}
                placeholder="Total amount"
                size="large"
                textStyle={styles.amountText} />
            <Layout>
                <Card>
                    <RadioGroup
                        selectedIndex={payerProfileIndex}
                        onChange={(index) => setPayerProfileIndex(index)}>
                        <Radio>{props.profiles[0].name}</Radio>
                        <Radio>{props.profiles[1].name}</Radio>
                    </RadioGroup>
                </Card>

                <PayerAccountSelectionCard
                    elegibleAccounts={getElegibleAccounts()}
                    accountId={payerAccountID}
                    setAccountId={(id) => setPayerAccountID(id)} />

                <GeneralSelectionCard
                    payeeName={payeeName}
                    setPayeeName={setPayeeName}
                    date={date}
                    setDate={setDate}
                    memo={memo}
                    setMemo={setMemo} />

                <Button
                    disabled={!everythingSelected}
                    onPress={() => navigateToAmountsScreen()}>
                    Enter amounts
                </Button>
            </Layout>
        </CustomScrollView>
    );
}

const styles = StyleSheet.create({
    amountText: {
        fontSize: 30,
        textAlign: 'right',
    },
});

const toIsoDateString = (date: Date): string => {
    // Stolen from here: https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
    const pad = (num: number) => {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export default InitializedSplittingScreen;
