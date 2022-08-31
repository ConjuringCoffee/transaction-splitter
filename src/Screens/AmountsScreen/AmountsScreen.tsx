import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import CustomScrollView from '../../Component/CustomScrollView';
import LoadingComponent from '../../Component/LoadingComponent';
import useLocalization from '../../Hooks/useLocalization';
import { convertAmountToText } from '../../Helper/AmountHelper';
import { CategoryCombo, readCategoryCombos } from '../../Repository/CategoryComboRepository';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { AmountEntry, buildSaveTransactions } from '../../YnabApi/BuildSaveTransactions';
import { Category, getActiveCategories } from '../../YnabApi/YnabApiWrapper';
import AmountCard from './AmountCard';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';

type MyNavigationProp = StackNavigationProp<StackParameterList, 'Amounts'>;
type MyRouteProp = RouteProp<StackParameterList, 'Amounts'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

const AmountsScreen = (props: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [amountEntries, setAmountEntries] = useState<Array<AmountEntry>>([]);
    const [payerCategories, setPayerCategories] = useState<Array<Category> | undefined>();
    const [debtorCategories, setDebtorCategories] = useState<Array<Category> | undefined>();
    const [categoryCombos, setCategoryCombos] = useState<CategoryCombo[]>();

    const basicData = props.route.params.basicData;

    useEffect(() => {
        getActiveCategories(basicData.payer.budget.id)
            .then(((categories) => setPayerCategories(categories)))
            .catch((error) => console.error(error));
        getActiveCategories(basicData.debtor.budget.id)
            .then(((categories) => setDebtorCategories(categories)))
            .catch((error) => console.error(error));
        readCategoryCombos()
            .then((combos) => setCategoryCombos(combos))
            .catch((error) => console.error(error));
    }, [basicData]);

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

    const setSplitPercentToPayer = (index: number, splitPercent: number | undefined) => {
        const entries = [...amountEntries];
        entries[index].splitPercentToPayer = splitPercent;
        setAmountEntries(entries);
    };

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

    const categoriesAreLoaded = payerCategories !== undefined && debtorCategories !== undefined && categoryCombos !== undefined;

    return (
        <CustomScrollView>
            {categoriesAreLoaded && numberFormatSettings
                ? <Layout>
                    {amountEntries.map((amountEntry, index) => {
                        return <AmountCard
                            key={index}
                            numberFormatSettings={numberFormatSettings}
                            amount={amountEntry.amount}
                            payerBudgetId={basicData.payer.budget.id}
                            debtorBudgetId={basicData.debtor.budget.id}
                            setAmount={(amount) => setAmount(index, amount)}
                            setMemo={(memo) => setMemo(index, memo)}
                            categoryCombos={categoryCombos}
                            payerCategories={payerCategories}
                            payerCategoryId={amountEntry.payerCategoryId}
                            setPayerCategoryId={(categoryId) => setPayerCategoryId(index, categoryId)}
                            debtorCategories={debtorCategories}
                            debtorCategoryId={amountEntry.debtorCategoryId}
                            setDebtorCategoryId={(categoryId) => setDebtorCategoryId(index, categoryId)}
                            splitPercentToPayer={amountEntry.splitPercentToPayer}
                            setSplitPercentToPayer={(splitPercent) => setSplitPercentToPayer(index, splitPercent)}
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
                                    ScreenNames.saveScreen,
                                    {
                                        basicData: basicData,
                                        payerSaveTransaction: saveTransactions.payer,
                                        debtorSaveTransaction: saveTransactions.debtor,
                                        payerCategories: payerCategories,
                                        debtorCategories: debtorCategories,
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
export default AmountsScreen;
