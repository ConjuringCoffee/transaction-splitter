import { Input, Layout, List, ListItem } from '@ui-kitten/components';
import React, { useState } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { CategoryCombo, selectAllCategoryCombos } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../redux/hooks';

interface RenderItemProps {
    item: CategoryCombo,
    index: number
}

type ScreenName = 'Category Combinations';

export const CategoryComboScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const categoryCombos = useAppSelector(selectAllCategoryCombos);
    const categoryCombosToDisplay = categoryCombos.filter((combo) => combo.name.toLowerCase().includes(nameFilter.toLowerCase()));

    const [navigateBack] = useNavigateBack(navigation);

    const renderItem = (props: RenderItemProps) => (
        <ListItem
            title={`${props.item.name}`}
            onPress={() => {
                route.params.onSelect(props.item);
                navigateBack();
            }} />
    );

    return (
        <Layout>
            <Input
                placeholder="Search category combos"
                value={nameFilter}
                autoFocus={true}
                onChangeText={(text) => setNameFilter(text)} />
            <List
                data={categoryCombosToDisplay}
                renderItem={renderItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open,
                // see https://stackoverflow.com/questions/57941342/button-cant-be-clicked-while-keyboard-is-visible-react-native
                keyboardShouldPersistTaps='handled' />
        </Layout>
    );
};
