import React from 'react';
import SplittingScreen from '../../Screens/SplittingScreen/SplittingScreen';
import SaveScreen from '../../Screens/SaveScreen/SaveScreen';
import AmountsScreen from '../../Screens/AmountsScreen/AmountsScreen';
import CategoryScreen from '../../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import {
    nameSplittingScreen, nameAmountsScreen, nameSaveScreen, nameCategoryScreen,
    nameAccessTokenScreen, nameCalculatorScreen, nameCalculationHistoryScreen, nameProfileSettingsScreen,
    nameCategoryComboSettingsScreen, nameCategoryComboScreen, nameSettingsOverviewScreen,
} from './ScreenNames';
import { StackParameterList as StackParameterList } from './ScreenParameters';
import AccessTokenScreen from '../../Screens/AccessTokenScreen/AccessTokenScreen';
import CalculatorScreen from '../../Screens/CalculatorScreen/CalculatorScreen';
import CalculationHistoryScreen from '../../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import ProfileSettingsScreen from '../../Screens/ProfileSettingsScreen/ProfileSettingsScreen';
import CategoryComboSettingsScreen from '../../Screens/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import CategoryComboScreen from '../../Screens/CategoryComboScreen/CategoryComboScreen';
import { Button } from '@ui-kitten/components';
import SettingsOverviewScreen from '../../Screens/SettingsOverviewScreen/SettingsOverviewScreen';
import SettingsIcon from '../../Component/SettingsIcon';

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
                name={nameSplittingScreen}
                component={SplittingScreen}
                options={({ navigation }) => ({
                    title: 'Transaction Splitter',
                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate(nameSettingsOverviewScreen)}
                            accessoryLeft={SettingsIcon}
                            size='large'
                            appearance='ghost' />
                    ),
                })}
            />
            <stack.Screen
                name={nameSettingsOverviewScreen}
                component={SettingsOverviewScreen}
                options={{ title: 'Settings' }} />
            <stack.Screen
                name={nameAmountsScreen}
                component={AmountsScreen}
                options={{ title: 'Enter amounts' }} />
            <stack.Screen
                name={nameCategoryScreen}
                component={CategoryScreen}
                options={{ title: 'Category' }} />
            <stack.Screen
                name={nameCategoryComboScreen}
                component={CategoryComboScreen}
                options={{ title: 'Category Combinations' }} />
            <stack.Screen
                name={nameCalculatorScreen}
                component={CalculatorScreen}
                options={{ title: 'Calculate the amount' }} />
            <stack.Screen
                name={nameCalculationHistoryScreen}
                component={CalculationHistoryScreen}
                options={{ title: 'History' }} />
            <stack.Screen
                name={nameSaveScreen}
                component={SaveScreen}
                options={{ title: 'Save' }} />
            <stack.Screen
                name={nameAccessTokenScreen}
                component={AccessTokenScreen}
                options={{ title: 'Access Token' }} />
            <stack.Screen
                name={nameProfileSettingsScreen}
                component={ProfileSettingsScreen}
                options={{ title: 'Profile Settings' }} />
            <stack.Screen
                name={nameCategoryComboSettingsScreen}
                component={CategoryComboSettingsScreen}
                options={{ title: 'Category Combination Settings' }} />
        </stack.Navigator>
    );
};

export default AppNavigator;
