import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { SplitPercentInput } from './SplitPercentInput';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategories } from '../../redux/features/ynab/ynabSlice';
import { SubAmountInput } from './SubAmountInput';
import { IconButton, Surface, TextInput } from 'react-native-paper';
import { CategoryInput } from './CategoryInput';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';
import { selectCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useTheme } from '../../Hooks/useTheme';

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

const ICON_CATEGORY_COMBO = 'call-split';
const ICON_DELETE = 'delete';

export const AmountView = <T extends keyof StackParameterList>(props: Props<T>) => {
    const [theme] = useTheme();
    const categoryCombos = useAppSelector(selectCategoryCombos);

    const setSplitPercentToPayer = useCallback(
        (splitPercent?: number) => props.setSplitPercentToPayer(props.index, splitPercent),
        [props.index, props.setSplitPercentToPayer],
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
        if (props.payerCategoryId !== undefined && props.debtorCategoryId !== undefined) {
            if (props.splitPercentToPayer === undefined) {
                setSplitPercentToPayer(DEFAULT_SPLIT_PERCENT_TO_PAYER);
            }
        } else if (props.splitPercentToPayer !== undefined) {
            setSplitPercentToPayer(undefined);
        }
    }, [props.payerCategoryId, props.debtorCategoryId, props.splitPercentToPayer, setSplitPercentToPayer]);


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

    const cardStyle = {
        padding: theme.cardPadding,
        gap: theme.spacing,
        borderRadius: theme.roundness * 3,
    };

    return (
        <Surface elevation={1} style={cardStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <SubAmountInput
                        value={props.amountText}
                        setValue={setAmountText}
                        navigation={props.navigation}
                    />
                </View>
                <IconButton
                    icon={ICON_DELETE}
                    onPress={onRemovePress}
                />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing }}>
                <View style={{ flex: 1, gap: theme.spacing }}>
                    <CategoryInput
                        label='Payer Category'
                        text={payerCategory?.name ?? ''}
                        budgetId={props.payerBudgetId}
                        onSelect={setPayerCategoryId}
                        navigation={props.navigation}
                    />
                    <CategoryInput
                        label='Debtor Category'
                        text={debtorCategory?.name ?? ''}
                        budgetId={props.debtorBudgetId}
                        onSelect={setDebtorCategoryId}
                        navigation={props.navigation}
                    />
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <IconButton icon={ICON_CATEGORY_COMBO} onPress={navigateToCategoryComboScreen} style={{ transform: [{ rotate: '270deg' }] }} />
                </View>
            </View>
            {!props.quickModeEnabled
                ? (
                    <View style={{ gap: theme.spacing }}>
                        <TextInput
                            label='Memo'
                            placeholder='Enter memo'
                            mode='outlined'
                            onChangeText={setMemo}
                        />
                        <SplitPercentInput
                            payerCategoryChosen={props.payerCategoryId !== undefined}
                            debtorCategoryChosen={props.debtorCategoryId !== undefined}
                            splitPercentToPayer={props.splitPercentToPayer}
                            setSplitPercentToPayer={setSplitPercentToPayer}
                        />
                    </View>
                )
                : null
            }
        </Surface>
    );
};
