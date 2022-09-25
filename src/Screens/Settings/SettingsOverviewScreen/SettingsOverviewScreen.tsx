import { MyStackScreenProps } from '../../../Helper/Navigation/ScreenParameters';
import { ScreenNames } from '../../../Helper/Navigation/ScreenNames';
import { List } from 'react-native-paper';
import { View } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import { selectBudgetCombos } from '../../../redux/features/budgetCombos/budgetCombos';
import { useCallback } from 'react';

type ScreenName = 'Settings Overview';

export const SettingsOverviewScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const budgetCombos = useAppSelector(selectBudgetCombos);

    const navigateToBudgetComboSettings = useCallback(() => {
        if (budgetCombos.length) {
            navigation.navigate(ScreenNames.EDIT_PROFILE_SCREEN);
        } else {
            navigation.navigate(ScreenNames.CREATE_PROFILE_SCREEN);
        }
    }, [navigation, budgetCombos]);

    return (
        <View>
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
                title='Budget Combinations'
                description='Connect budgets of your account'
                onPress={navigateToBudgetComboSettings} />
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
