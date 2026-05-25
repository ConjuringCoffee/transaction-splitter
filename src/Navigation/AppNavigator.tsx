import React, { useCallback } from 'react';
import { SplittingScreen } from '../Screens/SplittingScreen/SplittingScreen';
import { SaveScreen } from '../Screens/SaveScreen/SaveScreen';
import { AmountsScreen } from '../Screens/AmountsScreen/AmountsScreen';
import { CategoryScreen } from '../Screens/CategoryScreen/CategoryScreen';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import { StackParameterList } from './ScreenParameters';
import { AccessTokenScreen } from '../Screens/Settings/AccessTokenScreen/AccessTokenScreen';
import { CalculatorScreen } from '../Screens/CalculatorScreen/CalculatorScreen';
import { CalculationHistoryScreen } from '../Screens/CalculationHistoryScreen/CalculationHistoryScreen';
import { SelectCategoryComboScreen } from '../Screens/SelectCategoryComboScreen/SelectCategoryComboScreen';
import { SettingsOverviewScreen } from '../Screens/Settings/SettingsOverviewScreen/SettingsOverviewScreen';
import { EditCategoryComboScreen } from '../Screens/Settings/CategoryCombos/EditCategoryComboScreen/EditCategoryComboScreen';
import { ScreenNames } from './ScreenNames';
import { CategoryComboSettingsScreen } from '../Screens/Settings/CategoryCombos/CategoryComboSettingsScreen/CategoryComboSettingsScreen';
import { CreateCategoryComboScreen } from '../Screens/Settings/CategoryCombos/CreateCategoryComboScreen/CreateCategoryComboScreen';
import { DisplaySettingsScreen } from '../Screens/Settings/DisplaySettingsScreen/DisplaySettingsScreen';
import { ProfileScreen } from '../Screens/Settings/Profiles/ProfileScreen/ProfileScreen';
import { InitialScreen } from '../Screens/InitialScreen/InitialScreen';
import { DevelopmentSettingsScreen } from '../Screens/Settings/DevelopmentSettingsScreen/DevelopmentSettingsScreen';
import { Appbar } from 'react-native-paper';
import { Keyboard } from 'react-native';
import { useTheme } from '../Hooks/useTheme';

type Props = {
    initialRouteName: keyof StackParameterList,
}

export const AppNavigator = ({ initialRouteName }: Props) => {
    return (
        <StackNavigator
            initialRouteName={initialRouteName}
        />
    );
};

const Stack = createStackNavigator<StackParameterList>();

const StackNavigator = ({ initialRouteName }: Props) => {
    const [theme] = useTheme();

    const header = useCallback(
        (stackHeaderProps: StackHeaderProps) => {
            const navigateBack = () => {
                Keyboard.dismiss();
                stackHeaderProps.navigation.goBack();
            };

            return (
                <Appbar.Header>
                    {
                        stackHeaderProps.back
                            ? (
                                <Appbar.BackAction
                                    onPress={navigateBack}
                                />
                            )
                            : null
                    }
                    <Appbar.Content
                        title={stackHeaderProps.options.title}
                    />
                    {stackHeaderProps.options.headerRight
                        ? stackHeaderProps.options.headerRight({})
                        : null}
                </Appbar.Header>
            );
        },
        [],
    );

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                header: header,
                cardStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Stack.Screen
                name={ScreenNames.SPLITTING_SCREEN}
                component={SplittingScreen}
            />
            <Stack.Screen
                name={ScreenNames.SETTINGS_OVERVIEW_SCREEN}
                component={SettingsOverviewScreen}
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
            />
            <Stack.Screen
                name={ScreenNames.SAVE_SCREEN}
                component={SaveScreen}
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
            />
            <Stack.Screen
                name={ScreenNames.PROFILE_SCREEN}
                component={ProfileScreen}
            />
            <Stack.Screen
                name={ScreenNames.INITIAL_SCREEN}
                component={InitialScreen}
            />
            <Stack.Screen
                name={ScreenNames.DEVELOPMENT_SETTINGS_SCREEN}
                component={DevelopmentSettingsScreen}
            />
        </Stack.Navigator >
    );
};
