import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Appbar, List, TextInput } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { CategoryCombo, selectCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../redux/hooks';

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

    useLayoutEffect(
        () => {
            const additions = (
                <Appbar.Action
                    icon={ICON_ADD}
                    onPress={() => {
                        navigation.navigate(ScreenNames.CREATE_CATEGORY_COMBO_SCREEN);
                    }}
                />);

            navigation.setOptions({
                header: () => (
                    <NavigationBar
                        title={SCREEN_TITLE}
                        navigation={navigation}
                        additions={additions} />),
            });
        },
        [navigation],
    );

    const [navigateBack] = useNavigateBack(navigation);

    const renderListItem = ({ item }: { item: CategoryCombo }) => (
        <List.Item
            key={item.id}
            title={item.name}
            onPress={() => {
                route.params.onSelect(item);
                navigateBack();
            }}
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
