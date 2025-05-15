import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { SplitPercentInput } from './SplitPercentInput';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';
import { SubAmountInput } from './SubAmountInput';
import { Divider, IconButton, TextInput } from 'react-native-paper';
import { CategoryInput } from './CategoryInput';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';
import { selectCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';

type Props<T extends keyof StackParameterList> = {
    index: number,
    amountText: string,
    payerBudgetId: string,
    debtorBudgetId: string,
    setAmountText: (index: number, newAmount: string) => void,
    setMemo: (index: number, memo: string) => void,
    payerCategoryId: string | undefined,
    setPayerCategoryId: (index: number, id: string | undefined) => void,
    debtorCategoryId: string | undefined,
    setDebtorCategoryId: (index: number, id: string | undefined) => void,
    splitPercentToPayer: number | undefined,
    setSplitPercentToPayer: (index: number, splitPercent: number | undefined) => void,
    onRemovePress: (index: number) => void,
    navigation: MyStackNavigationProp<T>,
    quickModeEnabled: boolean,
}

const DEFAULT_SPLIT_PERCENT_TO_PAYER = 50;

const ICON_CATEGORY_COMBO = 'vector-combine';
const ICON_DELETE = 'delete';

export const AmountView = <T extends keyof StackParameterList>(props: Props<T>) => {
    const categoryCombos = useAppSelector(selectCategoryCombos);

    const setSplitPercentToPayer = useCallback(
        (splitPercent?: number) => props.setSplitPercentToPayer(props.index, splitPercent),
        [props],
    );

    const setAmountText = useCallback(
        (amountText: string) => props.setAmountText(props.index, amountText),
        [props],
    );

    const setPayerCategoryId = useCallback(
        (id: string | undefined) => props.setPayerCategoryId(props.index, id),
        [props],
    );

    const setDebtorCategoryId = useCallback(
        (id: string | undefined) => props.setDebtorCategoryId(props.index, id),
        [props],
    );

    const setMemo = useCallback(
        (memo: string) => props.setMemo(props.index, memo),
        [props],
    );

    const onRemovePress = useCallback(
        () => props.onRemovePress(props.index),
        [props],
    );

    useEffect(() => {
        // TODO: Clean this up
        if (props.payerCategoryId === undefined || props.debtorCategoryId === undefined) {
            if (props.splitPercentToPayer !== undefined) {
                setSplitPercentToPayer();
            }
        } else if (props.payerCategoryId !== undefined && props.debtorCategoryId !== undefined && props.splitPercentToPayer === undefined) {
            setSplitPercentToPayer(DEFAULT_SPLIT_PERCENT_TO_PAYER);
        }
    }, [props, setSplitPercentToPayer]);


    const navigateToCategoryComboScreen = useCallback(
        () => {
            props.navigation.navigate(ScreenNames.SELECT_CATEGORY_COMBO_SCREEN, {
                onSelect: (categoryComboId) => {
                    const categoryCombo = categoryCombos.find((c) => c.id === categoryComboId);

                    if (!categoryCombo) {
                        throw new Error(`Expected to find a category como for ID ${categoryComboId}, but did not`);
                    }

                    categoryCombo.categories.forEach((category) => {
                        if (props.payerBudgetId === category.budgetId) {
                            setPayerCategoryId(category.id);
                        } else if (props.debtorBudgetId === category.budgetId) {
                            setDebtorCategoryId(category.id);
                        } else {
                            throw new Error('Combination belongs to another budget');
                        }
                    });
                },
            });
        },
        [props.navigation, props.payerBudgetId, props.debtorBudgetId, categoryCombos, setPayerCategoryId, setDebtorCategoryId],
    );

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
                        setValue={setAmountText}
                        navigation={props.navigation}
                    />
                    <IconButton
                        icon={ICON_DELETE}
                        onPress={onRemovePress}
                    />
                </View>

                <View style={styles.flexContainer}>
                    <CategoryInput
                        label='Payer Category'
                        text={payerCategory?.name ?? ''}
                        budgetId={props.payerBudgetId}
                        onSelect={setPayerCategoryId}
                        navigation={props.navigation}
                    />
                    <IconButton
                        style={styles.categoryComboButton}
                        icon={ICON_CATEGORY_COMBO}
                        onPress={navigateToCategoryComboScreen}
                    />
                    <CategoryInput
                        label='Debtor Category'
                        text={debtorCategory?.name ?? ''}
                        budgetId={props.debtorBudgetId}
                        onSelect={setDebtorCategoryId}
                        navigation={props.navigation}
                    />
                </View>
                {!props.quickModeEnabled
                    ? (
                        <>
                            <SplitPercentInput
                                payerCategoryChosen={props.payerCategoryId !== undefined}
                                debtorCategoryChosen={props.debtorCategoryId !== undefined}
                                splitPercentToPayer={props.splitPercentToPayer}
                                setSplitPercentToPayer={setSplitPercentToPayer}
                            />
                            <TextInput
                                label='Memo'
                                placeholder='Enter memo'
                                onChangeText={setMemo}
                            />
                        </>
                    )
                    : null
                }
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
