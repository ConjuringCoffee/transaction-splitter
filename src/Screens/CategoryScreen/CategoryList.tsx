import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { selectCategoryGroups, selectCategories, selectInternalMasterCategoryGroupId, CategoryGroup } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { CategoryListItem } from './CategoryListItem';

interface Props {
    categoryNameFilter: string,
    budgetId: string,
    onCategorySelect: (categoryId: string) => void,
}

export const CategoryList = (props: Props) => {
    const categoryGroups = useAppSelector((state) => selectCategoryGroups(state, props.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));
    const internalMasterCategoryGroupId = useAppSelector((state) => selectInternalMasterCategoryGroupId(state, props.budgetId));

    const renderListItem = ({ item }: { item: CategoryGroup }) => {
        if (item.id === internalMasterCategoryGroupId
            || item.deleted
            || item.hidden) {
            return null;
        }

        const filteredCategories = Object.values(item.categories).filter((id) => {
            const category = categories[id];
            return category.name.toLowerCase().includes(props.categoryNameFilter.toLowerCase())
                && !category.deleted
                && !category.hidden;
        });

        if (filteredCategories.length === 0) {
            return null;
        }

        return (
            <List.Section >
                <List.Subheader>
                    {item.name}
                </List.Subheader>

                {filteredCategories.map((categoryId) => {
                    const category = categories[categoryId];

                    return (
                        <CategoryListItem
                            key={category.id}
                            budgetId={props.budgetId}
                            categoryId={category.id}
                            onCategorySelect={props.onCategorySelect}
                        />
                    );
                })
                }
            </List.Section >);
    };

    return (
        <FlatList
            data={Object.values(categoryGroups)}
            renderItem={renderListItem}
            // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open
            //   See: https://stackoverflow.com/a/57941568
            keyboardShouldPersistTaps='handled'
        />
    );
};
