import React, { useEffect, useLayoutEffect } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { Appbar, List } from 'react-native-paper';
import { addCategoryCombo, CategoryCombo, deleteCategoryCombo, selectAllCategoryCombos, updateCategoryCombo } from '../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { View } from 'react-native';
import { selectAllProfiles } from '../../redux/features/profiles/profilesSlice';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';

type ScreenName = 'Category Combinations Settings';

const SCREEN_TITLE = 'Category Combinations';
const SCREEN_SUBTITLE = 'Settings';
const ADD_ICON = 'plus';

export const CategoryComboSettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectAccessToken);
    const categoryCombos = useAppSelector(selectAllCategoryCombos);

    const profiles = useAppSelector(selectAllProfiles);

    const categoriesFirstProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[0]?.budgetId));
    const categoriesSecondProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profiles[1]?.budgetId));

    useEffect(() => {
        if (categoriesFirstProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: profiles[0].budgetId }));
        }
    }, [dispatch, profiles, categoriesFirstProfileFetchStatus, accessToken]);

    useEffect(() => {
        if (categoriesSecondProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: profiles[1].budgetId }));
        }
    }, [dispatch, profiles, categoriesSecondProfileFetchStatus, accessToken]);

    const everythingLoaded
        = categoriesFirstProfileFetchStatus === LoadingStatus.SUCCESSFUL
        && categoriesSecondProfileFetchStatus === LoadingStatus.SUCCESSFUL;

    useLayoutEffect(() => {
        const additions = (
            <Appbar.Action
                icon={ADD_ICON}
                disabled={!everythingLoaded}
                onPress={() => {
                    navigation.navigate(ScreenNames.CREATE_CATEGORY_COMBO_SCREEN, {
                        createCategoryCombo: async (categoryCombo) => {
                            dispatch(addCategoryCombo(categoryCombo));
                        },
                    });
                }}
            />);

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    subtitle={SCREEN_SUBTITLE}
                    navigation={navigation}
                    additions={additions} />),
        });
    }, [
        everythingLoaded,
        navigation,
        profiles,
        dispatch,
    ]);

    const renderListItem = (categoryCombo: CategoryCombo) => (
        <List.Item
            key={categoryCombo.id}
            title={categoryCombo.name}
            onPress={() => {
                navigation.navigate(ScreenNames.EDIT_CATEGORY_COMBO_SCREEN, {
                    categoryCombo: categoryCombo,
                    saveCategoryCombo: async (categoryCombo) => {
                        dispatch(updateCategoryCombo({ categoryCombo }));
                    },
                    deleteCategoryCombo: async () => {
                        dispatch(deleteCategoryCombo(categoryCombo.id));
                    },
                });
            }}
        />
    );

    return (
        <View>
            {
                everythingLoaded
                    ? categoryCombos.map(renderListItem)
                    : <LoadingComponent />
            }
        </View>
    );
};
