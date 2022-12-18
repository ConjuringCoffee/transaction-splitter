import { useCallback } from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { selectCategory } from '../../redux/features/ynab/ynabSlice';

interface Props {
    budgetId: string,
    categoryId: string,
    onCategorySelect: (categoryId: string) => void,
}

export const CategoryListItem = ({ budgetId, categoryId, onCategorySelect }: Props) => {
    const category = useAppSelector((state) => selectCategory(state, budgetId, categoryId));

    const onSelect = useCallback(
        () => onCategorySelect(categoryId),
        [onCategorySelect, categoryId],
    );

    return (
        <List.Item
            key={category.id}
            title={category.name}
            onPress={onSelect}
        />
    );
};
