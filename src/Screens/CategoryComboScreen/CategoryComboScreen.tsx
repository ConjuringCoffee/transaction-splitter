import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Input, Layout, List, ListItem } from '@ui-kitten/components';
import React, { useState } from 'react';
import { CategoryCombo } from '../../Repository/CategoryComboRepository';
import { SplittingScreenStackParameterList } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Category Combinations';
type MyNavigationProp = StackNavigationProp<SplittingScreenStackParameterList, ScreenName>;
type MyRouteProp = RouteProp<SplittingScreenStackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

const CategoryComboScreen = ({ route, navigation }: Props) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [navigatedBack, setNavigatedBack] = useState<boolean>(false);
    const categoryCombosToDisplay = route.params.categoryCombos.filter((combo) => combo.name.toLowerCase().includes(nameFilter.toLowerCase()));

    interface RenderItemProps {
        item: CategoryCombo,
        index: number
    }

    const selectAndNavigateBack = (categoryCombo: CategoryCombo): void => {
        if (navigatedBack) {
            // Avoid selecting the category multiple times if pressed multiple times fast
            return;
        }

        setNavigatedBack(true);
        navigation.goBack();
        route.params.onSelect(categoryCombo);
    };

    const renderItem = (props: RenderItemProps) => (
        <ListItem
            title={`${props.item.name}`}
            onPress={() => {
                selectAndNavigateBack(props.item);
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

export default CategoryComboScreen;
