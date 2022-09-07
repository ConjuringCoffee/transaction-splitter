import React, { useEffect, useState } from 'react';
import { Button, Card, Icon, Input, Layout, Text } from '@ui-kitten/components';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { ImageProps, StyleSheet } from 'react-native';
import { Navigation } from './AmountsScreen';
import RemoveIcon from '../../Component/RemoveIcon';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import SplitPercentInput from './SplitPercentInput';
import NumberInput from '../../Component/NumberInput';
import { NumberFormatSettings } from '../../Hooks/useLocalization';

interface Props {
    // TODO: Pass AmountEntry instead of all these separate variables
    key: number,
    numberFormatSettings: NumberFormatSettings,
    amount: number,
    payerBudgetId: string,
    debtorBudgetId: string,
    setAmount: (amount: number) => void,
    setMemo: (memo: string) => void,
    payerCategories: Array<Category>,
    payerCategoryId: string | undefined,
    setPayerCategoryId: (id: string | undefined) => void,
    debtorCategories: Array<Category>,
    debtorCategoryId: string | undefined,
    setDebtorCategoryId: (id: string | undefined) => void,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (splitPercent: number | undefined) => void,
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
                props.navigation.navigate(ScreenNames.categoryScreen, {
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

const AmountCard = (props: Props) => {
    const [previousCalculations, setPreviousCalculations] = useState<Array<string>>([]);

    useEffect(() => {
        // TODO: Solve dependency issues
        if (props.payerCategoryId === undefined || props.debtorCategoryId === undefined) {
            props.setSplitPercentToPayer(undefined);
        } else if (props.payerCategoryId !== undefined && props.debtorCategoryId !== undefined && props.splitPercentToPayer === undefined) {
            props.setSplitPercentToPayer(defaultSplitPercentToPayer);
        }
    }, [props.payerCategoryId, props.debtorCategoryId]);

    const payerCategory = props.payerCategories.find((c) => c.id === props.payerCategoryId);
    const debtorCategory = props.debtorCategories.find((c) => c.id === props.debtorCategoryId);

    return (
        <Card>
            <Layout style={styles.container}>
                <NumberInput
                    numberFormatSettings={props.numberFormatSettings}
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
                                    ScreenNames.calculatorScreen,
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
                    accessoryLeft={RemoveIcon}
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
                        props.navigation.navigate(ScreenNames.categoryComboScreen, {
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
                setSplitPercentToPayer={props.setSplitPercentToPayer} />
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

export default AmountCard;
