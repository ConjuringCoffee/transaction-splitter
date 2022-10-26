import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { ScreenNames } from '../../../Navigation/ScreenNames';
import { List } from 'react-native-paper';
import { View } from 'react-native';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { useCallback } from 'react';
import { selectProfiles } from '../../../redux/features/profiles/profilesSlice';
import { useNavigationBar } from '../../../Hooks/useNavigationBar';

type ScreenName = 'Settings Overview';

const SCREEN_TITLE = 'Settings';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const profiles = useAppSelector(selectProfiles);

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

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
                }}
            />
            <List.Item
                title='Profile'
                description='Connect two budgets of your account'
                onPress={navigateToProfileSettings}
            />
            <List.Item
                title='Category Combinations'
                description='Combine categories under a single name'
                onPress={() => {
                    navigation.navigate(ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN);
                }}
            />
            <List.Item
                title='Display Settings'
                onPress={() => {
                    navigation.navigate(ScreenNames.DISPLAY_SETTINGS_SCREEN);
                }}
            />
        </View>
    );
};
