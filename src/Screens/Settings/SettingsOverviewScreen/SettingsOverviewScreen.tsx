import { MyStackScreenProps } from '../../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../../Helper/Navigation/ScreenNames';
import { List } from 'react-native-paper';
import { View } from 'react-native';

type ScreenName = 'Settings Overview';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    return (
        <View>
            <List.Item
                title='Display Settings'
                onPress={() => {
                    navigation.navigate(ScreenNames.DISPLAY_SETTINGS_SCREEN);
                }} />
            <List.Item
                title='Access Token'
                description='Necessary to access the YNAB API'
                onPress={() => {
                    navigation.navigate(ScreenNames.ACCESS_TOKEN_SCREEN);
                }} />
            <List.Item
                title='Profiles'
                description='The two profiles to split the transactions to'
                onPress={() => {
                    navigation.navigate(ScreenNames.PROFILE_SETTINGS_SCREEN);
                }} />
            <List.Item
                title='Category Combinations'
                description='Combine categories of your profiles'
                onPress={() => {
                    navigation.navigate(ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN);
                }} />
        </View>
    );
};
