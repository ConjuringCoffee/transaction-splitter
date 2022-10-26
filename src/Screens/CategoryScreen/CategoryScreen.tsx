import React, { useCallback, useMemo, useState } from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { Appbar, TextInput } from 'react-native-paper';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { View } from 'react-native';
import { CategoryList } from './CategoryList';
import { useNavigationBar } from '../../Hooks/useNavigationBar';

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


    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                onPress={() => selectAndNavigateBack(undefined)}
                icon={ICON_DESELECT}
            />
        ),
        [selectAndNavigateBack],
    );

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

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
