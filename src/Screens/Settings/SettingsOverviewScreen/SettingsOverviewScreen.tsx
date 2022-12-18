import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { ScreenNames } from '../../../Navigation/ScreenNames';
import { List, Text } from 'react-native-paper';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import React, { useCallback } from 'react';
import { selectProfiles } from '../../../redux/features/profiles/profilesSlice';
import { useNavigationBar } from '../../../Hooks/useNavigationBar';
import Constants from 'expo-constants';
import { View, StyleSheet } from 'react-native';

type ScreenName = 'Settings Overview';

const SCREEN_TITLE = 'Settings';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profiles = useAppSelector(selectProfiles);

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

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

    // @ts-ignore
    const branchName = Constants.manifest2?.metadata.branchName ?? '';

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
            <Text style={styles.text}>
                {branchName} @ {Constants.manifest2?.createdAt}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        margin: 8,
    },
});
