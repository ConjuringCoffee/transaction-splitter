import React, { useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { List, TextInput } from 'react-native-paper';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { CategoryCombo, selectAllCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../redux/hooks';

type ScreenName = 'Category Combinations';

export const SelectCategoryComboScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const categoryCombos = useAppSelector(selectAllCategoryCombos);
    const categoryCombosToDisplay = categoryCombos.filter((combo) => combo.name.toLowerCase().includes(nameFilter.toLowerCase()));

    const [navigateBack] = useNavigateBack(navigation);

    const renderListItem = ({ item }: { item: CategoryCombo }) => (
        <List.Item
            key={item.id}
            title={item.name}
            onPress={() => {
                route.params.onSelect(item);
                navigateBack();
            }} />
    );

    return (
        <View>
            <TextInput
                value={nameFilter}
                autoFocus={true}
                onChangeText={setNameFilter}
                placeholder="Search category combos" />
            <FlatList
                data={categoryCombosToDisplay}
                renderItem={renderListItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open
                //   See: https://stackoverflow.com/a/57941568
                keyboardShouldPersistTaps='handled' />
        </View>
    );
};