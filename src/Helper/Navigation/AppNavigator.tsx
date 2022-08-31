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
import CategoryComboSettingsScreen from '../../Screens/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import CategoryComboScreen from '../../Screens/CategoryComboScreen/CategoryComboScreen';
import { Button } from '@ui-kitten/components';
import SettingsOverviewScreen from '../../Screens/SettingsOverviewScreen/SettingsOverviewScreen';
import SettingsIcon from '../../Component/SettingsIcon';
import { EditCategoryComboScreen } from '../../Screens/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';

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
                component={SplittingScreen}
                options={({ navigation }) => ({
                    title: 'Transaction Splitter',
                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate(ScreenNames.settingsOverviewScreen)}
                            accessoryLeft={SettingsIcon}
                            size='large'
                            appearance='ghost' />
                    ),
                })}
            />
            <stack.Screen
                name={ScreenNames.settingsOverviewScreen}
                component={SettingsOverviewScreen}
                options={{ title: 'Settings' }} />
            <stack.Screen
                name={ScreenNames.amountsScreen}
                component={AmountsScreen}
                options={{ title: 'Enter amounts' }} />
            <stack.Screen
                name={ScreenNames.categoryScreen}
                component={CategoryScreen}
                options={{ title: 'Category' }} />
            <stack.Screen
                name={ScreenNames.categoryComboScreen}
                component={CategoryComboScreen}
                options={{ title: 'Category Combinations' }} />
            <stack.Screen
                name={ScreenNames.calculatorScreen}
                component={CalculatorScreen}
                options={{ title: 'Calculate the amount' }} />
            <stack.Screen
                name={ScreenNames.calculationHistoryScreen}
                component={CalculationHistoryScreen}
                options={{ title: 'History' }} />
            <stack.Screen
                name={ScreenNames.saveScreen}
                component={SaveScreen}
                options={{ title: 'Save' }} />
            <stack.Screen
                name={ScreenNames.accessTokenScreen}
                component={AccessTokenScreen}
                options={{ title: 'Access Token' }} />
            <stack.Screen
                name={ScreenNames.profileSettingsScreen}
                component={ProfileSettingsScreen}
                options={{ title: 'Profile Settings' }} />
            <stack.Screen
                name={ScreenNames.categoryComboSettingsScreen}
                component={CategoryComboSettingsScreen}
                options={{ title: 'Category Combinations Settings' }} />
            <stack.Screen
                name={ScreenNames.editCategoryComboScreen}
                component={EditCategoryComboScreen}
                options={{ title: 'Category Combination Settings' }} />
        </stack.Navigator>
    );
};

export default AppNavigator;
