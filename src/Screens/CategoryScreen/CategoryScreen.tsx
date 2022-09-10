import React, { useCallback, useState } from 'react';
import { Input, Layout, List, ListItem } from '@ui-kitten/components';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { useAppSelector } from '../../redux/hooks';
import { selectActiveCategories } from '../../redux/features/ynab/ynabSlice';
import { useNavigateBack } from '../../Hooks/useNavigateBack';

type ScreenName = 'Category Selection';

interface RenderItemProps {
    item: Category,
    index: number
}

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

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={'Categories'}
                    navigation={navigation}
                    additions={
                        <Appbar.Action
                            onPress={() => selectAndNavigateBack(undefined)}
                            icon='delete' />
                    }
                />
            ),
        });
    }, [
        navigation,
        selectAndNavigateBack,
    ]);

    const renderItem = (props: RenderItemProps) => (
        <ListItem
            title={`${props.item.name}`}
            onPress={() => {
                selectAndNavigateBack(props.item.id);
            }} />
    );

    return (
        <Layout>
            <Input
                placeholder="Search categories"
                value={nameFilter}
                autoFocus={true}
                onChangeText={(text) => setNameFilter(text)} />
            <List
                data={categoriesToDisplay}
                renderItem={renderItem}
                // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open,
                // see https://stackoverflow.com/questions/57941342/button-cant-be-clicked-while-keyboard-is-visible-react-native
                keyboardShouldPersistTaps='handled' />
        </Layout>
    );
};
