import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Input, Layout, Text } from '@ui-kitten/components';
import { ImageProps, StyleSheet } from 'react-native';
import { Navigation } from './AmountsScreen';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { SplitPercentInput } from './SplitPercentInput';
import { NumberInput } from '../../Component/NumberInput';
import { useAppSelector } from '../../redux/hooks';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';

interface Props {
    // TODO: Pass AmountEntry instead of all these separate variables
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

const CategoryLayout = (props: CategoryLayoutProps) => (
    <Layout style={styles.categoryLayout}>
        <Text>{props.label}</Text>

        <Button
            onPress={() => {
                props.navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onSelect(categoryId),
                });
            }}>
            {props.text}
        </Button>
    </Layout>
);

const defaultSplitPercentToPayer = 50;

const CalculatorIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='chevron-right-outline' />
);

const CategoryComboIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='more-horizontal-outline' />
);

export const AmountCard = (props: Props) => {
    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    const { index, payerCategoryId, debtorCategoryId, splitPercentToPayer, setSplitPercentToPayer } = props;

    useEffect(() => {
        // TODO: Clean this up
        if (payerCategoryId === undefined || debtorCategoryId === undefined) {
            if (splitPercentToPayer !== undefined) {
                setSplitPercentToPayer(index, undefined);
            }
        } else if (payerCategoryId !== undefined && debtorCategoryId !== undefined && splitPercentToPayer === undefined) {
            setSplitPercentToPayer(index, defaultSplitPercentToPayer);
        }
    }, [payerCategoryId, debtorCategoryId, splitPercentToPayer, index, setSplitPercentToPayer]);

    const payerCategories = useAppSelector((state) => selectCategories(state, props.payerBudgetId));
    const debtorCategories = useAppSelector((state) => selectCategories(state, props.debtorBudgetId));

    const payerCategory = props.payerCategoryId ? payerCategories[props.payerCategoryId] : undefined;
    const debtorCategory = props.debtorCategoryId ? debtorCategories[props.debtorCategoryId] : undefined;

    return (
        <Card>
            <Layout style={styles.container}>
                <NumberInput
                    number={props.amount}
                    setNumber={props.setAmount}
                    style={styles.amount}
                    label='Amount'
                    placeholder='€'
                    textStyle={styles.amountText}
                    accessoryRight={() => (
                        // This could also be a touchable opacity, but I'm too stupid for the CSS
                        <Button
                            style={styles.calculatorButton}
                            size='small'
                            appearance='outline'
                            accessoryLeft={CalculatorIcon}
                            onPress={() => {
                                props.navigation.navigate(
                                    ScreenNames.CALCULATOR_SCREEN,
                                    {
                                        currentAmount: props.amount,
                                        setAmount: props.setAmount,
                                        previousCalculations: previousCalculations,
                                        setPreviousCalculations: setPreviousCalculations,
                                    },
                                );
                            }} />
                    )} />
                <Button
                    style={styles.removeButton}
                    appearance='ghost'
                    size='large'
                    accessoryLeft={<Icon {...props} name='trash-2-outline' />}
                    onPress={() => props.onRemovePress()} />
            </Layout>

            <Layout style={styles.container}>
                <CategoryLayout
                    label='Payer Category'
                    text={payerCategory?.name ? payerCategory?.name : ''}
                    budgetId={props.payerBudgetId}
                    onSelect={props.setPayerCategoryId}
                    navigation={props.navigation} />
                <Button
                    size='small'
                    style={styles.categoryComboButton}
                    accessoryLeft={CategoryComboIcon}
                    onPress={() => {
                        props.navigation.navigate(ScreenNames.SELECT_CATEGORY_COMBO_SCREEN, {
                            onSelect: (categoryCombo) => {
                                if (categoryCombo.categories.length !== 2) {
                                    throw new Error('Cannot handle combinations not consisting of exactly two categories');
                                }

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
                    }} />
                <CategoryLayout
                    label='Debtor Category'
                    text={debtorCategory?.name ? debtorCategory?.name : ''}
                    budgetId={props.debtorBudgetId}
                    onSelect={props.setDebtorCategoryId}
                    navigation={props.navigation} />
            </Layout>
            <SplitPercentInput
                payerCategoryChosen={props.payerCategoryId !== undefined}
                debtorCategoryChosen={props.debtorCategoryId !== undefined}
                splitPercentToPayer={props.splitPercentToPayer}
                setSplitPercentToPayer={(splitPercent) => props.setSplitPercentToPayer(index, splitPercent)} />
            <Layout style={styles.container}>
                <Input
                    style={styles.memo}
                    label='Memo'
                    placeholder='Enter memo'
                    onChangeText={(text) => props.setMemo(text)} />

            </Layout>
        </Card>);
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryLayout: {
        flex: 1,
        margin: 5,
    },
    amount: {
        flex: 1,
        marginHorizontal: 10,
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: '60%',
    },
    memo: {
        flex: 1,
        margin: 5,
    },
    removeButton: {
        flex: 1,
        margin: 2,
        flexGrow: 0,
        flexShrink: 1,
    },
    amountText: {
        textAlign: 'right',
    },
    calculatorButton: {
        height: 1,
    },
    categoryComboButton: {
        // TODO: Fix this mess. Research table layout, see also:
        //   https://github.com/steve192/opencookbook-frontend/blob/dbe12bd38d69ba0fc582a7dc7e3a39cc800b0825/src/components/IngredientList.tsx#L39
        marginTop: 25,
        marginBottom: 5,
    },
});
