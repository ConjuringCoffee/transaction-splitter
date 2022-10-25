import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { SplitPercentInput } from './SplitPercentInput';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';
import { SubAmountInput } from './SubAmountInput';
import { Divider, IconButton, TextInput } from 'react-native-paper';
import { CategoryInput } from './CategoryInput';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';

interface Props<T extends keyof StackParameterList> {
    key: number,
    index: number,
    amountText: string,
    payerBudgetId: string,
    debtorBudgetId: string,
    setAmountText: (newAmount: string) => void,
    setMemo: (memo: string) => void,
    payerCategoryId: string | undefined,
    setPayerCategoryId: (id: string | undefined) => void,
    debtorCategoryId: string | undefined,
    setDebtorCategoryId: (id: string | undefined) => void,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (index: number, splitPercent: number | undefined) => void,
    onRemovePress: () => void,
    navigation: MyStackNavigationProp<T>,
}

const DEFAULT_SPLIT_PERCENT_TO_PAYER = 50;

const ICON_CATEGORY_COMBO = 'vector-combine';
const ICON_DELETE = 'delete';

export const AmountView = <T extends keyof StackParameterList>(props: Props<T>) => {
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
        <View>
            <View style={styles.mainView}>
                <View style={styles.flexContainer}>
                    <SubAmountInput
                        value={props.amountText}
                        setValue={props.setAmountText}
                        navigation={props.navigation}
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
            </View>
            <Divider />
        </View>
    );
};

const styles = StyleSheet.create({
    mainView: {
        marginVertical: 10,
    },
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryComboButton: {
        // TODO: Fix this mess. Research table layout, see also:
        //   https://github.com/steve192/opencookbook-frontend/blob/dbe12bd38d69ba0fc582a7dc7e3a39cc800b0825/src/components/IngredientList.tsx#L39
        marginTop: 25,
        marginBottom: 5,
    },
});
