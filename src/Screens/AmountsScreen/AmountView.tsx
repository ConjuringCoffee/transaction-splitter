import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Navigation } from './AmountsScreen';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { SplitPercentInput } from './SplitPercentInput';
import { useAppSelector } from '../../redux/hooks';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';
import { SubAmountInput } from '../../Component/SubAmountInput';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';

interface Props {
    key: number,
    index: number,
    amount: number,
    payerBudgetId: string,
    debtorBudgetId: string,
    setAmount: (amount: number) => void,
    setMemo: (memo: string) => void,
    payerCategoryId: string | undefined,
    setPayerCategoryId: (id: string | undefined) => void,
    debtorCategoryId: string | undefined,
    setDebtorCategoryId: (id: string | undefined) => void,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (index: number, splitPercent: number | undefined) => void,
    onRemovePress: () => void,
    navigation: Navigation
}

interface CategoryLayoutProps {
    label: string,
    text: string,
    budgetId: string,
    onSelect: (id?: string) => void,
    navigation: Navigation
}

const CategoryInput = (props: CategoryLayoutProps) => (
    <View style={styles.categoryInput}>
        <Text>
            {props.label}
        </Text>

        <Button
            mode='contained'
            onPress={() => {
                props.navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onSelect(categoryId),
                });
            }}>
            {props.text}
        </Button>
    </View>
);

const DEFAULT_SPLIT_PERCENT_TO_PAYER = 50;

const ICON_CATEGORY_COMBO = 'vector-combine';
const ICON_DELETE = 'delete';

export const AmountView = (props: Props) => {
    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    const { index, payerCategoryId, debtorCategoryId, splitPercentToPayer, setSplitPercentToPayer } = props;

    useEffect(() => {
        // TODO: Clean this up
        if (payerCategoryId === undefined || debtorCategoryId === undefined) {
            if (splitPercentToPayer !== undefined) {
                setSplitPercentToPayer(index, undefined);
            }
        } else if (payerCategoryId !== undefined && debtorCategoryId !== undefined && splitPercentToPayer === undefined) {
            setSplitPercentToPayer(index, DEFAULT_SPLIT_PERCENT_TO_PAYER);
        }
    }, [payerCategoryId, debtorCategoryId, splitPercentToPayer, index, setSplitPercentToPayer]);

    const payerCategories = useAppSelector((state) => selectCategories(state, props.payerBudgetId));
    const debtorCategories = useAppSelector((state) => selectCategories(state, props.debtorBudgetId));

    const payerCategory = props.payerCategoryId ? payerCategories[props.payerCategoryId] : undefined;
    const debtorCategory = props.debtorCategoryId ? debtorCategories[props.debtorCategoryId] : undefined;

    return (
        <View style={styles.mainView}>
            <View style={styles.flexContainer}>
                <SubAmountInput
                    amount={props.amount}
                    setAmount={props.setAmount}
                    navigateToCalculatorScreen={() => {
                        props.navigation.navigate(
                            ScreenNames.CALCULATOR_SCREEN,
                            {
                                currentAmount: props.amount,
                                setAmount: props.setAmount,
                                previousCalculations: previousCalculations,
                                setPreviousCalculations: setPreviousCalculations,
                            },
                        );
                    }}
                />
                <IconButton
                    icon={ICON_DELETE}
                    onPress={() => props.onRemovePress()}
                />
            </View>

            <View style={styles.flexContainer}>
                <CategoryInput
                    label='Payer Category'
                    text={payerCategory?.name ? payerCategory?.name : ''}
                    budgetId={props.payerBudgetId}
                    onSelect={props.setPayerCategoryId}
                    navigation={props.navigation}
                />
                <IconButton
                    style={styles.categoryComboButton}
                    icon={ICON_CATEGORY_COMBO}
                    onPress={() => {
                        props.navigation.navigate(ScreenNames.SELECT_CATEGORY_COMBO_SCREEN, {
                            onSelect: (categoryCombo) => {
                                categoryCombo.categories.forEach((category) => {
                                    if (props.payerBudgetId === category.budgetId) {
                                        props.setPayerCategoryId(category.id);
                                    } else if (props.debtorBudgetId === category.budgetId) {
                                        props.setDebtorCategoryId(category.id);
                                    } else {
                                        throw new Error('Combination belongs to another budget');
                                    }
                                });
                            },
                        });
                    }}
                />
                <CategoryInput
                    label='Debtor Category'
                    text={debtorCategory?.name ? debtorCategory?.name : ''}
                    budgetId={props.debtorBudgetId}
                    onSelect={props.setDebtorCategoryId}
                    navigation={props.navigation}
                />
            </View>
            <SplitPercentInput
                payerCategoryChosen={props.payerCategoryId !== undefined}
                debtorCategoryChosen={props.debtorCategoryId !== undefined}
                splitPercentToPayer={props.splitPercentToPayer}
                setSplitPercentToPayer={(splitPercent) => props.setSplitPercentToPayer(index, splitPercent)}
            />
            <TextInput
                label='Memo'
                placeholder='Enter memo'
                onChangeText={(text) => props.setMemo(text)}
            />
        </View>);
};

const styles = StyleSheet.create({
    mainView: {
        marginVertical: 10,
    },
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryInput: {
        flex: 1,
        margin: 5,
    },
    categoryComboButton: {
        // TODO: Fix this mess. Research table layout, see also:
        //   https://github.com/steve192/opencookbook-frontend/blob/dbe12bd38d69ba0fc582a7dc7e3a39cc800b0825/src/components/IngredientList.tsx#L39
        marginTop: 25,
        marginBottom: 5,
    },
});
