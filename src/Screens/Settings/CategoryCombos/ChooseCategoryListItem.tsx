import { useCallback, useMemo } from 'react';
import { List } from 'react-native-paper';
import { ScreenNames } from '../../../Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../../../Navigation/ScreenParameters';
import { selectBudgetById, selectCategories } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';

type Props<T extends keyof StackParameterList> = {
    budgetId: string,
    budgetDisplayName: string | undefined,
    navigation: MyStackNavigationProp<T>,
    selectedCategoryId?: string,
    onCategorySelect: (categoryId?: string) => void
}

const ICON_CATEGORY_SET = 'check-circle-outline';
const ICON_CATEGORY_NOT_SET = 'checkbox-blank-circle-outline';
const ICON_CATEGORY_INVALID = 'alert-circle-outline';

export const ChooseCategoryListItem = <T extends keyof StackParameterList>({ selectedCategoryId, ...props }: Props<T>) => {
    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));

    const categoryName = selectedCategoryId ? categories[selectedCategoryId]?.name : undefined;
    const displayBudgetName = props.budgetDisplayName ?? budget.name;

    const title = useMemo(
        () => {
            if (categoryName !== undefined) {
                return categoryName;
            } else if (selectedCategoryId === undefined) {
                return 'None';
            } else {
                return 'Invalid category';
            }
        },
        [categoryName, selectedCategoryId],
    );

    const icon = useMemo(
        () => {
            if (categoryName !== undefined) {
                return ICON_CATEGORY_SET;
            } else if (selectedCategoryId === undefined) {
                return ICON_CATEGORY_NOT_SET;
            } else {
                return ICON_CATEGORY_INVALID;
            }
        },
        [categoryName, selectedCategoryId],
    );

    const listIcon = useCallback(
        (props: object) => (<List.Icon {...props} icon={icon} />),
        [icon],
    );

    return (
        <List.Item
            title={title}
            description={`Category from ${displayBudgetName}`}
            left={listIcon}
            onPress={() => {
                props.navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                });
            }}
        />
    );
};
