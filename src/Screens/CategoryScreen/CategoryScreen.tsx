import React, { useCallback, useLayoutEffect, useState } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { Appbar, List, TextInput } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { useAppSelector } from '../../redux/hooks';
import { CategoryGroup, selectCategories, selectCategoryGroups, selectInternalMasterCategoryGroupId } from '../../redux/features/ynab/ynabSlice';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { FlatList, View } from 'react-native';

type ScreenName = 'Category Selection';

const SCREEN_TITLE = 'Select category';
const ICON_DESELECT = 'minus-circle-outline';

export const CategoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');

    const categoryGroups = useAppSelector((state) => selectCategoryGroups(state, route.params.budgetId));
    const categories = useAppSelector((state) => selectCategories(state, route.params.budgetId));
    const internalMasterCategoryGroupId = useAppSelector((state) => selectInternalMasterCategoryGroupId(state, route.params.budgetId));

    const [navigateBack] = useNavigateBack(navigation);
    const { onSelect } = route.params;

    const selectAndNavigateBack = useCallback((categoryId: string | undefined): void => {
        onSelect(categoryId);
        navigateBack();
    }, [onSelect, navigateBack]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={
                        <Appbar.Action
                            onPress={() => selectAndNavigateBack(undefined)}
                            icon={ICON_DESELECT} />
                    }
                />
            ),
        });
    }, [
        navigation,
        selectAndNavigateBack,
    ]);

    const renderListItem = ({ item }: { item: CategoryGroup }) => {
        if (item.id === internalMasterCategoryGroupId
            || item.deleted
            || item.hidden) {
            return null;
        }

        const filteredCategories = Object.values(item.categories).filter((id) => {
            const category = categories[id];
            return category.name.toLowerCase().includes(nameFilter.toLowerCase())
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
                        <List.Item
                            key={category.id}
                            title={category.name}
                            onPress={() => selectAndNavigateBack(category.id)}
                        />);
                })
                }
            </List.Section >);
    };

    return (
        <View>
            <TextInput
                value={nameFilter}
                autoFocus={true}
                onChangeText={setNameFilter} />
            <FlatList
                data={Object.values(categoryGroups)}
                renderItem={renderListItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open
                //   See: https://stackoverflow.com/a/57941568
                keyboardShouldPersistTaps='handled' />
        </View>
    );
};
