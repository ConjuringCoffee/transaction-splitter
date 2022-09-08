import React, { useCallback, useState } from 'react';
import { Input, Layout, List, ListItem } from '@ui-kitten/components';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { CommonActions } from '@react-navigation/native';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { useAppSelector } from '../../redux/hooks';
import { selectActiveCategories } from '../../redux/features/ynab/ynabSlice';

type ScreenName = 'Category Selection';

export const CategoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const categories = useAppSelector((state) => selectActiveCategories(state, route.params.budgetId));
    const categoriesToDisplay = categories.filter((category) => category.name.toLowerCase().includes(nameFilter.toLowerCase()));

    interface RenderItemProps {
        item: Category,
        index: number
    }

    const selectAndNavigateBack = useCallback((categoryId: string | undefined): void => {
        // This prevents multiple fast button presses to navigate back multiple times
        // Source: https://github.com/react-navigation/react-navigation/issues/6864#issuecomment-635686686
        navigation.dispatch((state) => ({ ...CommonActions.goBack(), target: state.key }));
        route.params.onSelect(categoryId);
    }, [navigation, route.params]);

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
