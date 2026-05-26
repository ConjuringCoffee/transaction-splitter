import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { ScreenNames } from '../../../Navigation/ScreenNames';
import { Appbar, List, Surface } from 'react-native-paper';

const chevronRight = (props: object) => <List.Icon {...props} icon='chevron-right' />;
import React, { useCallback, useMemo } from 'react';
import { useNavigationSettings } from '../../../Hooks/useNavigationSettings';
import { CustomScrollView } from '../../../Component/CustomScrollView';
import { BackHandler, View } from 'react-native';
import { InitialFetchStatus, useInitialFetchStatus } from '../../../Hooks/useInitialFetchStatus';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../Hooks/useTheme';

type ScreenName = 'Settings Overview';

const SCREEN_TITLE = 'Settings';

const ICON_CONFIRM = 'check';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const [initialFetchstatus] = useInitialFetchStatus();
    const [theme] = useTheme();

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
                iconColor={theme.colors.onPrimary}
                onPress={navigateToSplittingScreen}
                disabled={initialFetchstatus !== InitialFetchStatus.READY}
            />
        ),
        [navigateToSplittingScreen, initialFetchstatus, theme],
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
        () => navigation.navigate(ScreenNames.PROFILE_SCREEN),
        [navigation],
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

    const cardStyle = {
        borderRadius: theme.roundness * 3,
        overflow: 'hidden' as const,
    };

    return (
        <CustomScrollView>
            <View style={{ padding: theme.cardPadding }}>
                <Surface elevation={1} style={cardStyle}>
                    <List.Item
                        title='Access Token'
                        description='Necessary to access the YNAB API'
                        onPress={navigateToAccessTokenScreen}
                        right={chevronRight}
                    />
                    <List.Item
                        title='Profile'
                        description='Connect two budgets of your account'
                        onPress={navigateToProfileSettingsScreen}
                        right={chevronRight}
                    />
                    <List.Item
                        title='Category Combinations'
                        description='Combine categories under a single name'
                        onPress={navigateToCategoryComboSettingsScreen}
                        right={chevronRight}
                    />
                    <List.Item
                        title='Display Settings'
                        onPress={navigateToDisplaySettingsScreen}
                        right={chevronRight}
                    />
                    <List.Item
                        title='Development Settings'
                        onPress={navigateToDevelopmentSettingsScreen}
                        right={chevronRight}
                    />
                </Surface>
            </View>
        </CustomScrollView>
    );
};
