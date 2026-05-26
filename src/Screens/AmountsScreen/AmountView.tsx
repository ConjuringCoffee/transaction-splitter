import React, { useCallback, useEffect, useRef } from 'react';
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
    setSplitPercentToPayer: (splitPercent: number | undefined) => void,
    onRemovePress: () => void,
    navigation: MyStackNavigationProp<T>,
    quickModeEnabled: boolean,
}

const DEFAULT_SPLIT_PERCENT_TO_PAYER = 50;

const ICON_CATEGORY_COMBO = 'call-split';
const ICON_DELETE = 'delete';

export const AmountView = <T extends keyof StackParameterList>({
    amountText,
    payerBudgetId,
    debtorBudgetId,
    setAmountText,
    setMemo,
    payerCategoryId,
    setPayerCategoryId,
    debtorCategoryId,
    setDebtorCategoryId,
    splitPercentToPayer,
    setSplitPercentToPayer,
    onRemovePress,
    navigation,
    quickModeEnabled,
}: Props<T>) => {
    const [theme] = useTheme();
    const categoryCombos = useAppSelector(selectCategoryCombos);

    // The reference is needed for the onSelect callback of the category combo screen.
    // A new category combo might be added while the user is on the category combo screen,
    // and we want to make sure we have the latest list of category combos when the user selects one.
    const categoryCombosRef = useRef(categoryCombos);
    categoryCombosRef.current = categoryCombos;

    useEffect(() => {
        if (payerCategoryId !== undefined && debtorCategoryId !== undefined) {
            if (splitPercentToPayer === undefined) {
                setSplitPercentToPayer(DEFAULT_SPLIT_PERCENT_TO_PAYER);
            }
        } else if (splitPercentToPayer !== undefined) {
            setSplitPercentToPayer(undefined);
        }
    }, [payerCategoryId, debtorCategoryId, splitPercentToPayer, setSplitPercentToPayer]);

    const navigateToCategoryComboScreen = useCallback(
        () => {
            navigation.navigate(ScreenNames.SELECT_CATEGORY_COMBO_SCREEN, {
                onSelect: (categoryComboId) => {
                    const categoryCombo = categoryCombosRef.current.find((c) => c.id === categoryComboId);

                    if (!categoryCombo) {
                        throw new Error(`Expected to find a category como for ID ${categoryComboId}, but did not`);
                    }

                    categoryCombo.categories.forEach((category) => {
                        if (payerBudgetId === category.budgetId) {
                            setPayerCategoryId(category.id);
                        } else if (debtorBudgetId === category.budgetId) {
                            setDebtorCategoryId(category.id);
                        } else {
                            throw new Error('Combination belongs to another budget');
                        }
                    });
                },
            });
        },
        [navigation, payerBudgetId, debtorBudgetId, setPayerCategoryId, setDebtorCategoryId],
    );

    const payerCategories = useAppSelector((state) => selectCategories(state, payerBudgetId));
    const debtorCategories = useAppSelector((state) => selectCategories(state, debtorBudgetId));

    const payerCategory = payerCategoryId ? payerCategories[payerCategoryId] : undefined;
    const debtorCategory = debtorCategoryId ? debtorCategories[debtorCategoryId] : undefined;

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
                        value={amountText}
                        setValue={setAmountText}
                        navigation={navigation}
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
                        budgetId={payerBudgetId}
                        onSelect={setPayerCategoryId}
                        navigation={navigation}
                    />
                    <CategoryInput
                        label='Debtor Category'
                        text={debtorCategory?.name ?? ''}
                        budgetId={debtorBudgetId}
                        onSelect={setDebtorCategoryId}
                        navigation={navigation}
                    />
                </View>
                <View style={{ justifyContent: 'center' }}>
                    <IconButton icon={ICON_CATEGORY_COMBO} onPress={navigateToCategoryComboScreen} style={{ transform: [{ rotate: '270deg' }] }} />
                </View>
            </View>
            {quickModeEnabled
                ? null
                : (
                    <View style={{ gap: theme.spacing }}>
                        <TextInput
                            label='Memo'
                            placeholder='Enter memo'
                            mode='outlined'
                            onChangeText={setMemo}
                        />
                        <SplitPercentInput
                            payerCategoryChosen={payerCategoryId !== undefined}
                            debtorCategoryChosen={debtorCategoryId !== undefined}
                            splitPercentToPayer={splitPercentToPayer}
                            setSplitPercentToPayer={setSplitPercentToPayer}
                        />
                    </View>
                )
            }
        </Surface>
    );
};
