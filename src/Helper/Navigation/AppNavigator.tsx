import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplittingScreen from '../../Screens/SplittingScreen/SplittingScreen';
import SaveScreen from '../../Screens/SaveScreen/SaveScreen';
import AmountsScreen from '../../Screens/AmountsScreen/AmountsScreen';
import CategoryScreen from '../../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import {
    nameSplittingScreen, nameAmountsScreen, nameSaveScreen, nameCategoryScreen,
    nameAccessTokenScreen, nameCalculatorScreen, nameCalculationHistoryScreen, nameProfileSettingsScreen,
    nameCategoryComboSettingsScreen, nameSplittingScreenStack, nameCategoryComboSettingsScreenStack, nameCategoryComboScreen,
} from './ScreenNames';
import { CategoryComboSettingsScreenParameterList, DrawerParameterList, SplittingScreenStackParameterList } from './ScreenParameters';
import AccessTokenScreen from '../../Screens/AccessTokenScreen/AccessTokenScreen';
import CalculatorScreen from '../../Screens/CalculatorScreen/CalculatorScreen';
import CalculationHistoryScreen from '../../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import ProfileSettingsScreen from '../../Screens/ProfileSettingsScreen/ProfileSettingsScreen';
import CategoryComboSettingsScreen from '../../Screens/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import CategoryComboScreen from '../../Screens/CategoryComboScreen/CategoryComboScreen';

const AppNavigator = () => {
    return (
        <DrawerNavigator />
    );
};

const Drawer = createDrawerNavigator<DrawerParameterList>();
const SplittingScreenStack = createStackNavigator<SplittingScreenStackParameterList>();
const CategoryComboSettingsScreenStack = createStackNavigator<CategoryComboSettingsScreenParameterList>();

const CategoryComboSettingsScreenStackNavigator = () => {
    return (
        <CategoryComboSettingsScreenStack.Navigator>
            <CategoryComboSettingsScreenStack.Screen
                name={nameCategoryComboSettingsScreen}
                component={CategoryComboSettingsScreen} />
            <CategoryComboSettingsScreenStack.Screen
                name={nameCategoryScreen}
                component={CategoryScreen}
                options={{ title: 'Category' }} />
        </CategoryComboSettingsScreenStack.Navigator>
    );
};

const SplittingScreenStackNavigator = () => {
    return (
        <SplittingScreenStack.Navigator>
            <SplittingScreenStack.Screen
                name={nameSplittingScreen}
                component={SplittingScreen}
                options={{ title: 'Split transaction: Enter basic data' }} />
            <SplittingScreenStack.Screen
                name={nameAmountsScreen}
                component={AmountsScreen}
                options={{ title: 'Splits' }} />
            <SplittingScreenStack.Screen
                name={nameCategoryScreen}
                component={CategoryScreen}
                options={{ title: 'Category' }} />
            <SplittingScreenStack.Screen
                name={nameCategoryComboScreen}
                component={CategoryComboScreen}
                options={{ title: 'Category Combinations' }} />
            <SplittingScreenStack.Screen
                name={nameCalculatorScreen}
                component={CalculatorScreen}
                options={{ title: 'Calculate the amount' }} />
            <SplittingScreenStack.Screen
                name={nameCalculationHistoryScreen}
                component={CalculationHistoryScreen}
                options={{ title: 'History' }} />
            <SplittingScreenStack.Screen
                name={nameSaveScreen}
                component={SaveScreen}
                options={{ title: 'Save' }} />
        </SplittingScreenStack.Navigator>
    );
};

const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName={nameSplittingScreenStack}>
        <Drawer.Screen
            name={nameSplittingScreenStack}
            component={SplittingScreenStackNavigator}
            options={{ title: 'Split Transaction' }} />
        <Drawer.Screen
            name={nameAccessTokenScreen}
            component={AccessTokenScreen}
            options={{ title: 'Access Token' }} />
        <Drawer.Screen
            name={nameProfileSettingsScreen}
            component={ProfileSettingsScreen}
            options={{ title: 'Profile Settings' }} />
        <Drawer.Screen
            name={nameCategoryComboSettingsScreenStack}
            component={CategoryComboSettingsScreenStackNavigator}
            options={{ title: 'Category Combination Settings' }} />
    </Drawer.Navigator >
);

export default AppNavigator;
