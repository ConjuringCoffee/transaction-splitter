import React, { useEffect } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ActivityIndicator, Appbar, List } from 'react-native-paper';
import { addCategoryCombo, CategoryCombo, deleteCategoryCombo, fetchCategoryCombos, selectAllCategoryCombos, selectCategoryComboFetchStatus, updateCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { View } from 'react-native';
import { fetchProfiles, selectAllProfiles, selectProfilesFetchStatus } from '../../redux/features/profiles/profilesSlice';
import { fetchCategories, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/Status';

type ScreenName = 'Category Combinations Settings';

export const CategoryComboSettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    const categoryCombosFetchStatus = useAppSelector(selectCategoryComboFetchStatus);
    const categoryCombos = useAppSelector(selectAllCategoryCombos);

    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const profiles = useAppSelector(selectAllProfiles);

    const categoriesFirstProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[0]?.budgetId));
    const categoriesSecondProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[1]?.budgetId));

    useEffect(() => {
        if (categoryCombosFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchCategoryCombos());
        }
    }, [categoryCombosFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.SUCCESSFUL && categoriesFirstProfileFetchStatus === 'idle') {
            dispatch(fetchCategories(profiles[0].budgetId));
        }
    }, [profilesFetchStatus, dispatch, profiles, categoriesFirstProfileFetchStatus]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.SUCCESSFUL && categoriesSecondProfileFetchStatus === 'idle') {
            dispatch(fetchCategories(profiles[1].budgetId));
        }
    }, [profilesFetchStatus, dispatch, profiles, categoriesSecondProfileFetchStatus]);

    const everythingLoaded =
        categoriesFirstProfileFetchStatus === 'successful'
        && categoriesSecondProfileFetchStatus === 'successful'
        && profilesFetchStatus.status === LoadingStatus.SUCCESSFUL
        && profiles.length === 2
        && categoryCombosFetchStatus.status === LoadingStatus.SUCCESSFUL;

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

    const renderItem = (categoryCombo: CategoryCombo, index: number) => (
        <List.Item
            // TODO: Generate key in categoryCombosSlice for each categoryCombo and use it here
            key={index}
            title={categoryCombo.name}
            onPress={() => {
                navigation.navigate(ScreenNames.editCategoryComboScreen, {
                    categoryCombo: categoryCombo,
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
                everythingLoaded
                    ? <List.Section>
                        {categoryCombos.map(renderItem)}
                    </List.Section>
                    : <ActivityIndicator />
            }
        </View>
    );
};

