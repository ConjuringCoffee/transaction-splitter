import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { List, ListItem } from '@ui-kitten/components';
import React, { useEffect } from 'react';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { addCategoryCombo, CategoryCombo, deleteCategoryCombo, fetchCategoryCombos, selectAllCategoryCombos, selectCategoryComboFetchStatus, updateCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { View } from 'react-native';
import { fetchProfiles, selectAllProfiles, selectProfilesFetchStatus } from '../../redux/features/profiles/profilesSlice';
import { fetchCategories, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';

type ScreenName = 'Category Combinations Settings';
export type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

interface RenderItemProps {
    item: CategoryCombo,
    index: number
}

export const CategoryComboSettingsScreen = ({ navigation, route }: Props) => {
    const dispatch = useAppDispatch();

    const categoryCombosFetchStatus = useAppSelector(selectCategoryComboFetchStatus);
    const categoryCombos = useAppSelector(selectAllCategoryCombos);

    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const profiles = useAppSelector(selectAllProfiles);

    const categoriesFirstProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[0]?.budgetId));
    const categoriesSecondProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[1]?.budgetId));

    useEffect(() => {
        if (categoryCombosFetchStatus.status === 'idle') {
            dispatch(fetchCategoryCombos());
        }
    }, [categoryCombosFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === 'idle') {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === 'successful' && categoriesFirstProfileFetchStatus === 'idle') {
            dispatch(fetchCategories(profiles[0].budgetId));
        }
    }, [profilesFetchStatus, dispatch, profiles, categoriesFirstProfileFetchStatus]);

    useEffect(() => {
        if (profilesFetchStatus.status === 'successful' && categoriesSecondProfileFetchStatus === 'idle') {
            dispatch(fetchCategories(profiles[1].budgetId));
        }
    }, [profilesFetchStatus, dispatch, profiles, categoriesSecondProfileFetchStatus]);

    const everythingLoaded =
        categoriesFirstProfileFetchStatus === 'successful'
        && categoriesSecondProfileFetchStatus === 'successful'
        && profilesFetchStatus.status === 'successful'
        && profiles.length === 2
        && categoryCombosFetchStatus.status === 'successful';

    React.useLayoutEffect(() => {
        let additions: JSX.Element | null = null;

        additions = (<Appbar.Action
            icon='plus'
            disabled={!everythingLoaded}
            onPress={() => {
                if (!everythingLoaded) {
                    throw Error('Initialization was not done yet');
                }
                navigation.navigate(ScreenNames.editCategoryComboScreen, {
                    profiles: profiles,
                    saveCategoryCombo: async (categoryCombo) => {
                        dispatch(addCategoryCombo(categoryCombo));
                    }
                });
            }}
        />);

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title='Category Combinations'
                    subtitle='Settings'
                    navigation={navigation}
                    additions={additions} />)
        })
    }, [
        everythingLoaded,
        navigation,
        profiles,
        dispatch
    ]);

    const renderItem = ({ item, index }: RenderItemProps) => (
        <ListItem
            title={`${item.name}`}
            onPress={() => {
                if (!everythingLoaded) {
                    throw Error('Initialization was not done yet');
                }

                navigation.navigate(ScreenNames.editCategoryComboScreen, {
                    categoryCombo: item,
                    profiles: profiles,
                    saveCategoryCombo: async (categoryCombo) => {
                        dispatch(updateCategoryCombo({ index, categoryCombo }));
                    },
                    deleteCategoryCombo: async () => {
                        dispatch(deleteCategoryCombo(index));
                    }
                });
            }}
        />
    )

    return (
        <View>
            {
                everythingLoaded ?
                    <List
                        data={categoryCombos}
                        renderItem={renderItem}
                    />
                    : <ActivityIndicator />
            }
        </View>
    );
};

