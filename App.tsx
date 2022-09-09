import React, { useEffect, useState } from 'react';
import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance, LogBox } from 'react-native';
import { AppNavigator } from './src/Helper/Navigation/AppNavigator';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
import merge from 'deepmerge';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { fetchAccessToken, selectAccessTokenFetchStatus } from './src/redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from './src/Helper/LoadingStatus';

LogBox.ignoreLogs([
    // Ignore this because we don't use state persistence or deep screen linking,
    // see https://stackoverflow.com/questions/60954742/how-to-pass-parent-function-to-child-screen-in-react-navigation-5
    'Non-serializable values were found in the navigation state',
]);

// Keep the splash screen visible while app is being prepared
SplashScreen.preventAutoHideAsync();

const combinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
combinedDefaultTheme.colors.primary = '#5C9CA4';

const combinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
combinedDarkTheme.colors.primary = '#0A393F';

const colorScheme = Appearance.getColorScheme();

const themeToUse = colorScheme === 'dark' ? combinedDarkTheme : combinedDefaultTheme;
const evaTheme = colorScheme === 'dark' ? eva.dark : eva.light;

// Set mode to use the primary colors even in the dark theme, otherwise everything is only grey-ish
themeToUse.mode = 'exact';

// Always use the light color scheme because both light and dark mode require white font
const STATUS_BAR_COLOR_SCHEME = 'light';

const ReduxProvidedApp = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    const dispatch = useAppDispatch();
    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);

    useEffect(() => {
        if (accessTokenFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchAccessToken());
        } else if (accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL) {
            setAppIsReady(true);
        }
    }, [accessTokenFetchStatus, dispatch]);

    useEffect(() => {
        if (appIsReady) {
            SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <PaperProvider theme={themeToUse}>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={evaTheme}>
                <NavigationContainer theme={themeToUse}>
                    {/* StatusBar is required to fix it being a white bar without elements in EAS build */}
                    <StatusBar style={STATUS_BAR_COLOR_SCHEME} />
                    <AppNavigator />
                </NavigationContainer>
            </ApplicationProvider>
        </PaperProvider>
    );
};

const App = () => {
    return (
        <ReduxProvider store={store}>
            <ReduxProvidedApp />
        </ReduxProvider>
    );
};

// Necessary for expo to work correctly:
// eslint-disable-next-line import/no-default-export
export default App;
