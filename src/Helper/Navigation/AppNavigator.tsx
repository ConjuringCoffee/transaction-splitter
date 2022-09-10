import React from 'react';
import { SplittingScreen } from '../../Screens/SplittingScreen/SplittingScreen';
import { SaveScreen } from '../../Screens/SaveScreen/SaveScreen';
import { AmountsScreen } from '../../Screens/AmountsScreen/AmountsScreen';
import { CategoryScreen } from '../../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParameterList } from './ScreenParameters';
import { AccessTokenScreen } from '../../Screens/AccessTokenScreen/AccessTokenScreen';
import { CalculatorScreen } from '../../Screens/CalculatorScreen/CalculatorScreen';
import { CalculationHistoryScreen } from '../../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import { ProfileSettingsScreen } from '../../Screens/ProfileSettingsScreen/ProfileSettingsScreen';
import { CategoryComboScreen } from '../../Screens/CategoryComboScreen/CategoryComboScreen';
import { SettingsOverviewScreen } from '../../Screens/SettingsOverviewScreen/SettingsOverviewScreen';
import { EditCategoryComboScreen } from '../../Screens/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';
import { CategoryComboSettingsScreen } from '../../Screens/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import { NavigationBar } from './NavigationBar';

export const AppNavigator = () => {
    return (
        <StackNavigator />
    );
};

const stack = createStackNavigator<StackParameterList>();

const StackNavigator = () => {
    return (
        <stack.Navigator>
            <stack.Screen
                name={ScreenNames.SPLITTING_SCREEN}
                component={SplittingScreen} />
            <stack.Screen
                name={ScreenNames.SETTINGS_OVERVIEW_SCREEN}
                component={SettingsOverviewScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Settings'
                        navigation={headerProps.navigation} />),
                }} />

            <stack.Screen
                name={ScreenNames.AMOUNTS_SCREEN}
                component={AmountsScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Enter amounts'
                        navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.CATEGORY_SCREEN}
                component={CategoryScreen} />
            <stack.Screen
                name={ScreenNames.CATEGORY_COMBO_SCREEN}
                component={CategoryComboScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Category Combinations'
                            navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.CALCULATOR_SCREEN}
                component={CalculatorScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Calculate the amount'
                        navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.CALCULATION_HISTORY_SCREEN}
                component={CalculationHistoryScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Calculation history'
                        navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.SAVE_SCREEN}
                component={SaveScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Save'
                        navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.ACCESS_TOKEN_SCREEN}
                component={AccessTokenScreen} />
            <stack.Screen
                name={ScreenNames.PROFILE_SETTINGS_SCREEN}
                component={ProfileSettingsScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Profiles'
                        subtitle='Settings'
                        navigation={headerProps.navigation} />),
                }} />
            <stack.Screen
                name={ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN}
                component={CategoryComboSettingsScreen} />
            <stack.Screen
                name={ScreenNames.EDIT_CATEGORY_COMBO_SCREEN}
                component={EditCategoryComboScreen} />
        </stack.Navigator>
    );
};
