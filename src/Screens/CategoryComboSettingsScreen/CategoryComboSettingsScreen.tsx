import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { List, ListItem } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Category, getActiveCategories } from '../../YnabApi/YnabApiWrapper';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { addCategoryCombo, CategoryCombo, deleteCategoryCombo, fetchCategoryCombos, selectAllCategoryCombos, selectCategoryComboFetchStatus, updateCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { View } from 'react-native';
import { fetchProfiles, selectAllProfiles, selectProfilesFetchStatus } from '../../redux/features/profiles/profilesSlice';

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
    const [categoriesFirstProfile, setCategoriesFirstProfile] = useState<Category[]>();
    const [categoriesSecondProfile, setCategoriesSecondProfile] = useState<Category[]>();

    const dispatch = useAppDispatch();

    const categoryCombosFetchStatus = useAppSelector(selectCategoryComboFetchStatus);
    const categoryCombos = useAppSelector(selectAllCategoryCombos);

    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const profiles = useAppSelector(selectAllProfiles);

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

    const everythingLoaded = categoriesFirstProfile !== undefined
        && categoriesSecondProfile !== undefined
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
                    categoriesFirstProfile: categoriesFirstProfile,
                    categoriesSecondProfile: categoriesSecondProfile,
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
        categoriesFirstProfile,
        categoriesSecondProfile,
        dispatch
    ]);

    useEffect(() => {
        if (profiles === undefined) {
            return;
        }

        initializeCategories(profiles[0].budgetId, setCategoriesFirstProfile);
        initializeCategories(profiles[1].budgetId, setCategoriesSecondProfile);
    }, [profiles]);

    const initializeCategories = (budgetId: string, setCategories: (categories: Category[]) => void) => {
        getActiveCategories(budgetId)
            .then(((categories) => setCategories(categories)))
            .catch((error) => {
                console.error(error);
                throw error;
            });
    };

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
                    categoriesFirstProfile: categoriesFirstProfile,
                    categoriesSecondProfile: categoriesSecondProfile,
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

