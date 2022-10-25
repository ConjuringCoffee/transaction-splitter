import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { MyStackScreenProps } from '../../../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../../../Helper/Navigation/ScreenNames';
import { NavigationBar } from '../../../../Helper/Navigation/NavigationBar';
import { Appbar, List } from 'react-native-paper';
import { CategoryCombo, selectCategoryCombos } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { View } from 'react-native';
import { selectProfiles } from '../../../../redux/features/profiles/profilesSlice';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../../../Helper/LoadingStatus';
import { LoadingComponent } from '../../../../Component/LoadingComponent';
import { selectAccessToken } from '../../../../redux/features/accessToken/accessTokenSlice';

type ScreenName = 'Category Combinations Settings';

const SCREEN_TITLE = 'Category Combinations';
const SCREEN_SUBTITLE = 'Settings';
const ADD_ICON = 'plus';

export const CategoryComboSettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectAccessToken);
    const categoryCombos = useAppSelector(selectCategoryCombos);

    const sortedCategoryCombos = useMemo(
        () => categoryCombos.slice().sort((a, b) => a.name.localeCompare(b.name)),
        [categoryCombos],
    );

    const profiles = useAppSelector(selectProfiles);

    // TODO: Allow selection of profile
    const profileUsed = profiles[0];

    const categoriesFirstProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profileUsed.budgets[0].budgetId));
    const categoriesSecondProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, profileUsed.budgets[1].budgetId));

    useEffect(() => {
        if (categoriesFirstProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: profileUsed.budgets[0].budgetId }));
        }
    }, [dispatch, profileUsed, categoriesFirstProfileFetchStatus, accessToken]);

    useEffect(() => {
        if (categoriesSecondProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: profileUsed.budgets[1].budgetId }));
        }
    }, [dispatch, profileUsed, categoriesSecondProfileFetchStatus, accessToken]);

    const everythingLoaded
        = categoriesFirstProfileFetchStatus === LoadingStatus.SUCCESSFUL
        && categoriesSecondProfileFetchStatus === LoadingStatus.SUCCESSFUL;

    useLayoutEffect(() => {
        const additions = (
            <Appbar.Action
                icon={ADD_ICON}
                disabled={!everythingLoaded}
                onPress={() => {
                    navigation.navigate(ScreenNames.CREATE_CATEGORY_COMBO_SCREEN);
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
                });
            }}
        />
    );

    return (
        <View>
            {
                everythingLoaded
                    ? sortedCategoryCombos.map(renderListItem)
                    : <LoadingComponent />
            }
        </View>
    );
};
