import { List } from 'react-native-paper';
import { ScreenNames } from '../Helper/Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../Helper/Navigation/ScreenParameters';
import { selectBudgetById, selectCategories } from '../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../redux/hooks';

interface Props<T extends keyof StackParameterList> {
    budgetId: string,
    budgetDisplayName: string | undefined,
    navigation: MyStackNavigationProp<T>,
    selectedCategoryId?: string,
    onCategorySelect: (categoryId?: string) => void
}

const ICON_CATEGORY_SET = 'check-circle-outline';
const ICON_CATEGORY_NOT_SET = 'checkbox-blank-circle-outline';

export const ChooseCategoryListItem = <T extends keyof StackParameterList>(props: Props<T>) => {
    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));
    const categoryName = props.selectedCategoryId ? categories[props.selectedCategoryId].name : undefined;

    const displayBudgetName = props.budgetDisplayName ?? budget.name;

    return (
        <List.Item
            title={categoryName ?? 'None'}
            description={`Category from ${displayBudgetName}`}
            left={(props) => <List.Icon {...props} icon={categoryName ? ICON_CATEGORY_SET : ICON_CATEGORY_NOT_SET} />}
            onPress={() => {
                props.navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onCategorySelect(categoryId),
                });
            }}
        />
    );
};
