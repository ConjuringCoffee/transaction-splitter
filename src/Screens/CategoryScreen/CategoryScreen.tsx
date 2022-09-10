import React, { useCallback, useLayoutEffect, useState } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { Appbar, List, TextInput } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { useAppSelector } from '../../redux/hooks';
import { Category, selectActiveCategories } from '../../redux/features/ynab/ynabSlice';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { FlatList, View } from 'react-native';

type ScreenName = 'Category Selection';

const SCREEN_TITLE = 'Select category';
const ICON_DESELECT = 'minus-circle-outline';

export const CategoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const categories = useAppSelector((state) => selectActiveCategories(state, route.params.budgetId));
    const categoriesToDisplay = categories.filter((category) => category.name.toLowerCase().includes(nameFilter.toLowerCase()));

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

    const renderListItem = ({ item }: { item: Category }) => (
        <List.Item
            key={item.id}
            title={item.name}
            onPress={() => selectAndNavigateBack(item.id)}
        />
    );

    return (
        <View>
            <TextInput
                value={nameFilter}
                autoFocus={true}
                onChangeText={setNameFilter} />
            <FlatList
                data={categoriesToDisplay}
                renderItem={renderListItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open
                //   See: https://stackoverflow.com/a/57941568
                keyboardShouldPersistTaps='handled' />
        </View>
    );
};
