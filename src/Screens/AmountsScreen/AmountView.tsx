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

export const AmountView = <T extends keyof StackParameterList>(props: Props<T>) => {
    const [theme] = useTheme();
    const categoryCombos = useAppSelector(selectCategoryCombos);

    useEffect(() => {
        if (props.payerCategoryId !== undefined && props.debtorCategoryId !== undefined) {
            if (props.splitPercentToPayer === undefined) {
                props.setSplitPercentToPayer(DEFAULT_SPLIT_PERCENT_TO_PAYER);
            }
        } else if (props.splitPercentToPayer !== undefined) {
            props.setSplitPercentToPayer(undefined);
        }
    }, [props.payerCategoryId, props.debtorCategoryId, props.splitPercentToPayer, props.setSplitPercentToPayer]);


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
                            props.setPayerCategoryId(category.id);
                        } else if (props.debtorBudgetId === category.budgetId) {
                            props.setDebtorCategoryId(category.id);
                        } else {
                            throw new Error('Combination belongs to another budget');
                        }
                    });
                },
            });
        },
        [props.navigation, props.payerBudgetId, props.debtorBudgetId, categoryCombos, props.setPayerCategoryId, props.setDebtorCategoryId],
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
                        setValue={props.setAmountText}
                        navigation={props.navigation}
                    />
                </View>
                <IconButton
                    icon={ICON_DELETE}
                    onPress={props.onRemovePress}
                />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing }}>
                <View style={{ flex: 1, gap: theme.spacing }}>
                    <CategoryInput
                        label='Payer Category'
                        text={payerCategory?.name ?? ''}
                        budgetId={props.payerBudgetId}
                        onSelect={props.setPayerCategoryId}
                        navigation={props.navigation}
                    />
                    <CategoryInput
                        label='Debtor Category'
                        text={debtorCategory?.name ?? ''}
                        budgetId={props.debtorBudgetId}
                        onSelect={props.setDebtorCategoryId}
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
                            onChangeText={props.setMemo}
                        />
                        <SplitPercentInput
                            payerCategoryChosen={props.payerCategoryId !== undefined}
                            debtorCategoryChosen={props.debtorCategoryId !== undefined}
                            splitPercentToPayer={props.splitPercentToPayer}
                            setSplitPercentToPayer={props.setSplitPercentToPayer}
                        />
                    </View>
                )
                : null
            }
        </Surface>
    );
};
