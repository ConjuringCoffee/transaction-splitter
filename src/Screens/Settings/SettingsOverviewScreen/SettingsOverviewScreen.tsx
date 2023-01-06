import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { ScreenNames } from '../../../Navigation/ScreenNames';
import { Appbar, List } from 'react-native-paper';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import React, { useCallback, useMemo } from 'react';
import { selectProfiles } from '../../../redux/features/profiles/profilesSlice';
import { useNavigationSettings } from '../../../Hooks/useNavigationSettings';
import { BackHandler, View } from 'react-native';
import { InitialFetchStatus, useInitialFetchStatus } from '../../../Hooks/useInitialFetchStatus';
import { useFocusEffect } from '@react-navigation/native';

type ScreenName = 'Settings Overview';

const SCREEN_TITLE = 'Settings';

const ICON_CONFIRM = 'check';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const [initialFetchstatus] = useInitialFetchStatus();
    const profiles = useAppSelector(selectProfiles);

    const navigateToSplittingScreen = useCallback(
        (): void => {
            navigation.reset({
                index: 0,
                routes: [{ name: ScreenNames.SPLITTING_SCREEN }],
            });
        },
        [navigation],
    );

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_CONFIRM}
                onPress={navigateToSplittingScreen}
                disabled={initialFetchstatus !== InitialFetchStatus.READY}
            />
        ),
        [navigateToSplittingScreen, initialFetchstatus],
    );

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (initialFetchstatus === InitialFetchStatus.READY) {
                    navigateToSplittingScreen();
                    return true;
                } else {
                    return false;
                }
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [initialFetchstatus, navigateToSplittingScreen]),
    );

    const navigateToProfileSettingsScreen = useCallback(
        () => {
            if (profiles.length) {
                // TODO: Support more than one profile
                navigation.navigate(ScreenNames.EDIT_PROFILE_SCREEN, { profileId: profiles[0].id });
            } else {
                navigation.navigate(ScreenNames.CREATE_PROFILE_SCREEN);
            }
        },
        [navigation, profiles],
    );

    const navigateToAccessTokenScreen = useCallback(
        () => navigation.navigate(ScreenNames.ACCESS_TOKEN_SCREEN),
        [navigation],
    );

    const navigateToCategoryComboSettingsScreen = useCallback(
        () => navigation.navigate(ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN),
        [navigation],
    );

    const navigateToDisplaySettingsScreen = useCallback(
        () => navigation.navigate(ScreenNames.DISPLAY_SETTINGS_SCREEN),
        [navigation],
    );

    const navigateToDevelopmentSettingsScreen = useCallback(
        () => navigation.navigate(ScreenNames.DEVELOPMENT_SETTINGS_SCREEN),
        [navigation],
    );

    return (
        <View>
            <List.Item
                title='Access Token'
                description='Necessary to access the YNAB API'
                onPress={navigateToAccessTokenScreen}
            />
            <List.Item
                title='Profile'
                description='Connect two budgets of your account'
                onPress={navigateToProfileSettingsScreen}
            />
            <List.Item
                title='Category Combinations'
                description='Combine categories under a single name'
                onPress={navigateToCategoryComboSettingsScreen}
            />
            <List.Item
                title='Display Settings'
                onPress={navigateToDisplaySettingsScreen}
            />
            <List.Item
                title='Development Settings'
                onPress={navigateToDevelopmentSettingsScreen}
            />
        </View>
    );
};
