import React, { useCallback, useLayoutEffect, useState } from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { Appbar, TextInput } from 'react-native-paper';
import { NavigationBar } from '../../Navigation/NavigationBar';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { View } from 'react-native';
import { CategoryList } from './CategoryList';

type ScreenName = 'Category Selection';

const SCREEN_TITLE = 'Select category';
const ICON_DESELECT = 'minus-circle-outline';

export const CategoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');

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
                            icon={ICON_DESELECT}
                        />
                    }
                />
            ),
        });
    }, [
        navigation,
        selectAndNavigateBack,
    ]);

    return (
        <View>
            <TextInput
                value={nameFilter}
                autoFocus={true}
                onChangeText={setNameFilter}
                placeholder='Search categories'
            />
            <CategoryList
                categoryNameFilter={nameFilter}
                budgetId={route.params.budgetId}
                onCategorySelect={selectAndNavigateBack}
            />
        </View>
    );
};
