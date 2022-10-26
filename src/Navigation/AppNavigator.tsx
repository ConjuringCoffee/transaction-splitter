import React from 'react';
import { SplittingScreen } from '../Screens/SplittingScreen/SplittingScreen';
import { SaveScreen } from '../Screens/SaveScreen/SaveScreen';
import { AmountsScreen } from '../Screens/AmountsScreen/AmountsScreen';
import { CategoryScreen } from '../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParameterList } from './ScreenParameters';
import { AccessTokenScreen } from '../Screens/Settings/AccessTokenScreen/AccessTokenScreen';
import { CalculatorScreen } from '../Screens/CalculatorScreen/CalculatorScreen';
import { CalculationHistoryScreen } from '../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import { SelectCategoryComboScreen } from '../Screens/SelectCategoryComboScreen/SelectCategoryComboScreen';
import { SettingsOverviewScreen } from '../Screens/Settings/SettingsOverviewScreen/SettingsOverviewScreen';
import { EditCategoryComboScreen } from '../Screens/Settings/CategoryCombos/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';
import { CategoryComboSettingsScreen } from '../Screens/Settings/CategoryCombos/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import { NavigationBar } from './NavigationBar';
import { CreateCategoryComboScreen } from '../Screens/Settings/CategoryCombos/CreateCategoryComboScreen/CreateCategoryComboScreen';
import { DisplaySettingsScreen } from '../Screens/Settings/DisplaySettingsScreen/DisplaySettingsScreen';
import { EditProfileScreen } from '../Screens/Settings/Profiles/EditProfileScreen/EditProfileScreen';
import { CreateProfileScreen } from '../Screens/Settings/Profiles/CreateProfilesScreen/CreateProfileScreen';
import { useAppSelector } from '../Hooks/useAppSelector';
import { selectProfiles } from '../redux/features/profiles/profilesSlice';

export const AppNavigator = () => {
    return (
        <StackNavigator />
    );
};

const Stack = createStackNavigator<StackParameterList>();

const StackNavigator = () => {
    const profiles = useAppSelector(selectProfiles);

    const initialRouteName = profiles.length === 1
        ? ScreenNames.SPLITTING_SCREEN
        : ScreenNames.SETTINGS_OVERVIEW_SCREEN;

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
        >
            <Stack.Screen
                name={ScreenNames.SPLITTING_SCREEN}
                component={SplittingScreen}
            />
            <Stack.Screen
                name={ScreenNames.SETTINGS_OVERVIEW_SCREEN}
                component={SettingsOverviewScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Settings'
                            navigation={headerProps.navigation}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name={ScreenNames.AMOUNTS_SCREEN}
                component={AmountsScreen}
            />
            <Stack.Screen
                name={ScreenNames.CATEGORY_SCREEN}
                component={CategoryScreen}
            />
            <Stack.Screen
                name={ScreenNames.SELECT_CATEGORY_COMBO_SCREEN}
                component={SelectCategoryComboScreen}
            />
            <Stack.Screen
                name={ScreenNames.CALCULATOR_SCREEN}
                component={CalculatorScreen}
            />
            <Stack.Screen
                name={ScreenNames.CALCULATION_HISTORY_SCREEN}
                component={CalculationHistoryScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Calculation history'
                            navigation={headerProps.navigation}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name={ScreenNames.SAVE_SCREEN}
                component={SaveScreen}
                options={{
                    header: (headerProps) => (
                        <NavigationBar
                            title='Save'
                            navigation={headerProps.navigation}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name={ScreenNames.ACCESS_TOKEN_SCREEN}
                component={AccessTokenScreen}
            />
            <Stack.Screen
                name={ScreenNames.CATEGORY_COMBO_SETTINGS_SCREEN}
                component={CategoryComboSettingsScreen}
            />
            <Stack.Screen
                name={ScreenNames.EDIT_CATEGORY_COMBO_SCREEN}
                component={EditCategoryComboScreen}
            />
            <Stack.Screen
                name={ScreenNames.CREATE_CATEGORY_COMBO_SCREEN}
                component={CreateCategoryComboScreen}
            />
            <Stack.Screen
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
            <Stack.Screen
                name={ScreenNames.EDIT_PROFILE_SCREEN}
                component={EditProfileScreen}
            />
            <Stack.Screen
                name={ScreenNames.CREATE_PROFILE_SCREEN}
                component={CreateProfileScreen}
            />
        </Stack.Navigator>
    );
};
