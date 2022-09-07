import React, { useState } from "react";
import CustomScrollView from "../../Component/CustomScrollView";
import NumberInput from "../../Component/NumberInput";
import { NumberFormatSettings } from "../../Hooks/useLocalization";
import { StyleSheet } from 'react-native';
import { Budget } from "../../YnabApi/YnabApiWrapper";
import { Button, Card, Layout, Radio, RadioGroup } from "@ui-kitten/components";
import PayerAccountSelectionCard from "./PayerAccountSelectionCard";
import GeneralSelectionCard from "./GeneralSelectionCard";
import { StackParameterList } from "../../Helper/Navigation/ScreenParameters";
import { ScreenNames } from "../../Helper/Navigation/ScreenNames";
import { StackNavigationProp } from "@react-navigation/stack";
import { Profile } from "../../redux/features/profiles/profilesSlice";
import { useAppSelector } from "../../redux/hooks";
import { selectAccountById, selectActiveAccounts, selectBudgetById } from "../../redux/features/ynab/ynabSlice";

interface Props {
    navigation: StackNavigationProp<StackParameterList>,
    numberFormatSettings: NumberFormatSettings,
    profiles: Profile[],
    budgets: Budget[],
}

const InitializedSplittingScreen = (props: Props) => {
    const [payerProfileIndex, setPayerProfileIndex] = useState<number>(0);
    const [payeeName, setPayeeName] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [memo, setMemo] = useState<string>('[Generated]');

    const payerProfile = props.profiles[payerProfileIndex];
    const debtorProfile = props.profiles[1 - payerProfileIndex];

    const payerBudget = useAppSelector((state) => selectBudgetById(state, payerProfile.budgetId));
    const [payerAccountID, setPayerAccountID] = useState<string>(payerBudget.accounts[0].id);
    const payerTransferAccount = useAppSelector((state) => selectAccountById(state, payerProfile.budgetId, payerProfile.debtorAccountId));
    const debtorBudget = useAppSelector((state) => selectBudgetById(state, debtorProfile.budgetId));

    const activeOnBudgetAccounts = useAppSelector((state) => selectActiveAccounts(state, payerProfile.budgetId));
    const elegibleAccounts = activeOnBudgetAccounts.filter((account) => payerProfile.elegibleAccountIds.find((id) => id === account.id));

    const everythingSelected = (
        payerAccountID !== undefined
        && totalAmount !== 0);

    const navigateToAmountsScreen = () => {
        props.navigation.navigate(
            ScreenNames.amountsScreen,
            {
                basicData: {
                    payer: {
                        budgetId: payerProfile.budgetId,
                        accountId: payerAccountID,
                        transferAccountId: payerProfile.debtorAccountId,
                        transferAccountPayeeId: payerTransferAccount.transferPayeeID
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
                        onChange={(index) => {
                            setPayerProfileIndex(index);
                            setPayerAccountID(debtorBudget.accounts[0].id);
                        }}>
                        <Radio>{props.profiles[0].name}</Radio>
                        <Radio>{props.profiles[1].name}</Radio>
                    </RadioGroup>
                </Card>

                <PayerAccountSelectionCard
                    elegibleAccounts={elegibleAccounts}
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
