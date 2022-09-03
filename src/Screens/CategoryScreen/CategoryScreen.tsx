import React, { useState } from 'react';
import { Button, Input, Layout, List, ListItem } from '@ui-kitten/components';
import { Category } from '../../YnabApi/YnabApiWrapper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import RemoveIcon from '../../Component/RemoveIcon';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';

type ScreenName = 'Category Selection';

type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

const CategoryScreen = ({ route, navigation }: Props) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [navigatedBack, setNavigatedBack] = useState<boolean>(false);

    const categoriesToDisplay = route.params.categories.filter((category) => category.name.toLowerCase().includes(nameFilter.toLowerCase()));

    interface RenderItemProps {
        item: Category,
        index: number
    }

    const selectAndNavigateBack = (categoryId: string | undefined): void => {
        if (navigatedBack) {
            // Avoid selecting the category multiple times if pressed multiple times fast
            // Bug: This doesn't work for the button in the navigation header
            return;
        }

        setNavigatedBack(true);
        navigation.goBack();
        route.params.onSelect(categoryId);
    };

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
        route.params.onSelect
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

const styles = StyleSheet.create({
    deselectButton: {
        marginRight: 10,
    },
});

export default CategoryScreen;
