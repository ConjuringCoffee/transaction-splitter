import { MyStackScreenProps } from '../../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../../Helper/Navigation/ScreenNames';
import { List } from 'react-native-paper';
import { View } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import { useCallback } from 'react';
import { selectProfiles } from '../../../redux/features/profiles/profilesSlice';

type ScreenName = 'Settings Overview';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profiles = useAppSelector(selectProfiles);

    const navigateToProfileSettings = useCallback(() => {
        if (profiles.length) {
            // TODO: Support more than one profile
            navigation.navigate(ScreenNames.EDIT_PROFILE_SCREEN, { profileId: profiles[0].id });
        } else {
            navigation.navigate(ScreenNames.CREATE_PROFILE_SCREEN);
        }
    }, [navigation, profiles]);

    return (
        <View>
            <List.Item
                title='Access Token'
                description='Necessary to access the YNAB API'
                onPress={() => {
                    navigation.navigate(ScreenNames.ACCESS_TOKEN_SCREEN);
                }} />
            <List.Item
                title='Profile'
                description='Connect two budgets of your account'
                onPress={navigateToProfileSettings} />
            <List.Item
                title='Category Combinations'
                description='Combine categories under a single name'
                onPress={() => {
                    navigation.navigate(ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN);
                }} />
            <List.Item
                title='Display Settings'
                onPress={() => {
                    navigation.navigate(ScreenNames.DISPLAY_SETTINGS_SCREEN);
                }} />
        </View>
    );
};