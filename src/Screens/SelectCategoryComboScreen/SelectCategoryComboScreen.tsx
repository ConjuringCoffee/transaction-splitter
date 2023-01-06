import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Appbar, TextInput } from 'react-native-paper';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { CategoryCombo, selectCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { useNavigationSettings } from '../../Hooks/useNavigationSettings';
import { CategoryComboListItem } from './CategoryComboListItem';

type ScreenName = 'Category Combinations';

const SCREEN_TITLE = 'Select Category Combo';
const ICON_ADD = 'plus';

export const SelectCategoryComboScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const categoryCombos = useAppSelector(selectCategoryCombos);

    const categoryCombosToDisplay = useMemo(
        () => categoryCombos.filter((combo) => combo.name.toLowerCase().includes(nameFilter.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)),
        [categoryCombos, nameFilter],
    );

    const navigateToCrateCategoryComboScreen = useCallback(
        () => navigation.navigate(ScreenNames.CREATE_CATEGORY_COMBO_SCREEN),
        [navigation],
    );

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_ADD}
                onPress={navigateToCrateCategoryComboScreen}
            />),
        [navigateToCrateCategoryComboScreen],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const [navigateBack] = useNavigateBack(navigation);

    const onSelect = useCallback(
        (categoryComboId: string): void => {
            route.params.onSelect(categoryComboId);
            navigateBack();
        },
        [navigateBack, route.params],
    );

    const renderListItem = ({ item }: { item: CategoryCombo }) => (
        <CategoryComboListItem
            key={item.id}
            categoryComboId={item.id}
            onSelect={onSelect}
        />
    );

    return (
        <View>
            <TextInput
                value={nameFilter}
                autoFocus={true}
                onChangeText={setNameFilter}
                placeholder="Search category combos"
            />
            <FlatList
                data={categoryCombosToDisplay}
                renderItem={renderListItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open
                //   See: https://stackoverflow.com/a/57941568
                keyboardShouldPersistTaps='handled'
            />
        </View>
    );
};
