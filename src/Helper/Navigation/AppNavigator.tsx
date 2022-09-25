import React from 'react';
import { SplittingScreen } from '../../Screens/SplittingScreen/SplittingScreen';
import { SaveScreen } from '../../Screens/SaveScreen/SaveScreen';
import { AmountsScreen } from '../../Screens/AmountsScreen/AmountsScreen';
import { CategoryScreen } from '../../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParameterList } from './ScreenParameters';
import { AccessTokenScreen } from '../../Screens/Settings/AccessTokenScreen/AccessTokenScreen';
import { CalculatorScreen } from '../../Screens/CalculatorScreen/CalculatorScreen';
import { CalculationHistoryScreen } from '../../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import { ProfileSettingsScreen } from '../../Screens/Settings/ProfileSettingsScreen/ProfileSettingsScreen';
import { SelectCategoryComboScreen } from '../../Screens/SelectCategoryComboScreen/SelectCategoryComboScreen';
import { SettingsOverviewScreen } from '../../Screens/Settings/SettingsOverviewScreen/SettingsOverviewScreen';
import { EditCategoryComboScreen } from '../../Screens/Settings/CategoryCombos/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';
import { CategoryComboSettingsScreen } from '../../Screens/Settings/CategoryCombos/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import { NavigationBar } from './NavigationBar';
import { CreateCategoryComboScreen } from '../../Screens/Settings/CategoryCombos/CreateCategoryComboScreen/CreateCategoryComboScreen';
import { DisplaySettingsScreen } from '../../Screens/Settings/DisplaySettingsScreen/DisplaySettingsScreen';
import { EditBudgetComboScreen } from '../../Screens/Settings/BudgetCombos/EditBudgetComboScreen/EditBudgetComboScreen';
import { CreateBudgetComboScreen } from '../../Screens/Settings/BudgetCombos/CreateBudgetComboScreen/CreateBudgetComboScreen';

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
                    header: (headerProps) => (
                        <NavigationBar
                            title='Settings'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />

            <stack.Screen
                name={ScreenNames.AMOUNTS_SCREEN}
                component={AmountsScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Enter amounts'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.CATEGORY_SCREEN}
                component={CategoryScreen} />
            <stack.Screen
                name={ScreenNames.SELECT_CATEGORY_COMBO_SCREEN}
                component={SelectCategoryComboScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Category Combinations'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.CALCULATOR_SCREEN}
                component={CalculatorScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Calculate the amount'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.CALCULATION_HISTORY_SCREEN}
                component={CalculationHistoryScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Calculation history'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.SAVE_SCREEN}
                component={SaveScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Save'
                            navigation={headerProps.navigation} />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.ACCESS_TOKEN_SCREEN}
                component={AccessTokenScreen} />
            <stack.Screen
                name={ScreenNames.PROFILE_SETTINGS_SCREEN}
                component={ProfileSettingsScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Profiles'
                            subtitle='Settings'
                            navigation={headerProps.navigation}
                        />
                    ),
                }} />
            <stack.Screen
                name={ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN}
                component={CategoryComboSettingsScreen} />
            <stack.Screen
                name={ScreenNames.EDIT_CATEGORY_COMBO_SCREEN}
                component={EditCategoryComboScreen} />
            <stack.Screen
                name={ScreenNames.CREATE_CATEGORY_COMBO_SCREEN}
                component={CreateCategoryComboScreen} />
            <stack.Screen
                name={ScreenNames.DISPLAY_SETTINGS_SCREEN}
                component={DisplaySettingsScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Display Settings'
                            navigation={headerProps.navigation}
                        />
                    ),
                }}
            />
            <stack.Screen
                name={ScreenNames.EDIT_BUDGET_COMBO_SCREEN}
                component={EditBudgetComboScreen} />
            <stack.Screen
                name={ScreenNames.CREATE_BUDGET_COMBO_SCREEN}
                component={CreateBudgetComboScreen} />
        </stack.Navigator>
    );
};
