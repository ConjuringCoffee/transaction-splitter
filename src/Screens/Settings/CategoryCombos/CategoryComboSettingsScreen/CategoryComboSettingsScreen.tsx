import React, { useEffect, useMemo } from 'react';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { ScreenNames } from '../../../../Navigation/ScreenNames';
import { Appbar, List } from 'react-native-paper';
import { CategoryCombo, selectCategoryCombos } from '../../../../redux/features/categoryCombos/categoryCombosSlice';
import { useAppSelector } from '../../../../Hooks/useAppSelector';
import { View } from 'react-native';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { CardSurface } from '../../../../Component/CardSurface';
import { selectProfile } from '../../../../redux/features/profile/profileSlice';
import { fetchCategoryGroups, selectCategoriesFetchStatus } from '../../../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../../../Helper/LoadingStatus';
import { LoadingComponent } from '../../../../Component/LoadingComponent';
import { selectAccessToken } from '../../../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';
import { useNavigationSettings } from '../../../../Hooks/useNavigationSettings';
import { useTheme } from '../../../../Hooks/useTheme';

type ScreenName = 'Category Combinations Settings';

const SCREEN_TITLE = 'Category Combos';
const ICON_ADD = 'plus';

export const CategoryComboSettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectAccessToken);
    const categoryCombos = useAppSelector(selectCategoryCombos);

    const sortedCategoryCombos = useMemo(
        () => categoryCombos.slice().sort((a, b) => a.name.localeCompare(b.name)),
        [categoryCombos],
    );

    const profile = useAppSelector(selectProfile);
    const budgets = profile!.budgets;

    const categoriesFirstProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, budgets[0].budgetId));
    const categoriesSecondProfileFetchStatus = useAppSelector((state) => selectCategoriesFetchStatus(state, budgets[1].budgetId));

    useEffect(() => {
        if (categoriesFirstProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: budgets[0].budgetId }));
        }
    }, [dispatch, budgets, categoriesFirstProfileFetchStatus, accessToken]);

    useEffect(() => {
        if (categoriesSecondProfileFetchStatus === LoadingStatus.IDLE) {
            dispatch(fetchCategoryGroups({ accessToken: accessToken, budgetId: budgets[1].budgetId }));
        }
    }, [dispatch, budgets, categoriesSecondProfileFetchStatus, accessToken]);

    const everythingLoaded
        = categoriesFirstProfileFetchStatus === LoadingStatus.SUCCESSFUL
        && categoriesSecondProfileFetchStatus === LoadingStatus.SUCCESSFUL;

    const [theme] = useTheme();

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_ADD}
                iconColor={theme.colors.onPrimary}
                disabled={!everythingLoaded}
                onPress={() => {
                    navigation.navigate(ScreenNames.CREATE_CATEGORY_COMBO_SCREEN);
                }}
            />
        ),
        [everythingLoaded, navigation, theme],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const chevronRight = (iconProps: object) => <List.Icon {...iconProps} icon='chevron-right' />;

    const renderListItem = (categoryCombo: CategoryCombo) => (
        <List.Item
            key={categoryCombo.id}
            title={categoryCombo.name}
            right={chevronRight}
            onPress={() => {
                navigation.navigate(ScreenNames.EDIT_CATEGORY_COMBO_SCREEN, {
                    categoryCombo: categoryCombo,
                });
            }}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            {everythingLoaded
                ? (
                    <CustomScrollView>
                        <CardSurface elevation={1}>
                            {sortedCategoryCombos.map(renderListItem)}
                        </CardSurface>
                    </CustomScrollView>
                )
                : <LoadingComponent />}
        </View>
    );
};
