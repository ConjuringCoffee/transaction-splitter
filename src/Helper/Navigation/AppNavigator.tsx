import React from 'react';
import SplittingScreen from '../../Screens/SplittingScreen/SplittingScreen';
import SaveScreen from '../../Screens/SaveScreen/SaveScreen';
import AmountsScreen from '../../Screens/AmountsScreen/AmountsScreen';
import CategoryScreen from '../../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParameterList } from './ScreenParameters';
import AccessTokenScreen from '../../Screens/AccessTokenScreen/AccessTokenScreen';
import CalculatorScreen from '../../Screens/CalculatorScreen/CalculatorScreen';
import CalculationHistoryScreen from '../../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import ProfileSettingsScreen from '../../Screens/ProfileSettingsScreen/ProfileSettingsScreen';
import CategoryComboScreen from '../../Screens/CategoryComboScreen/CategoryComboScreen';
import SettingsOverviewScreen from '../../Screens/SettingsOverviewScreen/SettingsOverviewScreen';
import { EditCategoryComboScreen } from '../../Screens/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';
import { CategoryComboSettingsScreen } from '../../Screens/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import { NavigationBar } from './NavigationBar';

const AppNavigator = () => {
    return (
        <StackNavigator />
    );
};

const stack = createStackNavigator<StackParameterList>();

const StackNavigator = () => {
    return (
        <stack.Navigator>
            <stack.Screen
                name={ScreenNames.splittingScreen}
                component={SplittingScreen} />
            <stack.Screen
                name={ScreenNames.settingsOverviewScreen}
                component={SettingsOverviewScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Settings'
                        navigation={headerProps.navigation} />)
                }} />

            <stack.Screen
                name={ScreenNames.amountsScreen}
                component={AmountsScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Enter amounts'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.categoryScreen}
                component={CategoryScreen} />
            <stack.Screen
                name={ScreenNames.categoryComboScreen}
                component={CategoryComboScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Category Combinations'
                            navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.calculatorScreen}
                component={CalculatorScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Calculate the amount'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.calculationHistoryScreen}
                component={CalculationHistoryScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Calculation history'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.saveScreen}
                component={SaveScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Save'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.accessTokenScreen}
                component={AccessTokenScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Access token'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.profileSettingsScreen}
                component={ProfileSettingsScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Profiles'
                        subtitle='Settings'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.categoryComboSettingsScreen}
                component={CategoryComboSettingsScreen}
                options={{
                    header: (headerProps) => (<NavigationBar
                        title='Category Combinations'
                        subtitle='Settings'
                        navigation={headerProps.navigation} />)
                }} />
            <stack.Screen
                name={ScreenNames.editCategoryComboScreen}
                component={EditCategoryComboScreen} />
        </stack.Navigator>
    );
};

export default AppNavigator;
