import React, { useEffect, useMemo, useState } from 'react';
import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Appearance, LogBox, View, StyleSheet } from 'react-native';
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
import { Store } from './src/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { fetchAccessToken, selectAccessTokenFetchStatus } from './src/redux/features/accessToken/accessTokenSlice';
import { LoadingStatus } from './src/Helper/LoadingStatus';
import { de, registerTranslation } from 'react-native-paper-dates';
import { fetchDisplaySettings, selectDisplaySettingsFetchStatus } from './src/redux/features/displaySettings/displaySettingsSlice';

LogBox.ignoreLogs([
    // Ignore this because we don't use state persistence or deep screen linking,
    // see https://stackoverflow.com/questions/60954742/how-to-pass-parent-function-to-child-screen-in-react-navigation-5
    'Non-serializable values were found in the navigation state',
]);

// Any translations used by the date picker must be registered beforehand
registerTranslation('de', de);

// Keep the splash screen visible while app is being prepared
SplashScreen.preventAutoHideAsync();

const combinedDefaultTheme = merge(merge(PaperDefaultTheme, NavigationDefaultTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
combinedDefaultTheme.colors.primary = '#5C9CA4';

const combinedDarkTheme = merge(merge(PaperDarkTheme, NavigationDarkTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
combinedDarkTheme.colors.primary = '#5C9CA4';

const colorScheme = Appearance.getColorScheme();

const themeToUse = colorScheme === 'dark' ? combinedDarkTheme : combinedDefaultTheme;
const evaTheme = colorScheme === 'dark' ? eva.dark : eva.light;

// Always use the light color scheme because both light and dark mode require white font
const STATUS_BAR_COLOR_SCHEME = 'light';

const ReduxProvidedApp = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    const dispatch = useAppDispatch();
    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);
    const displaySettingsFetchStatus = useAppSelector(selectDisplaySettingsFetchStatus);

    useEffect(() => {
        if (accessTokenFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchAccessToken());
        } else if (accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL) {
            setAppIsReady(true);
        }
    }, [accessTokenFetchStatus, dispatch]);

    useEffect(() => {
        if (displaySettingsFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchDisplaySettings());
        }
    }, [displaySettingsFetchStatus, dispatch]);

    const everythingLoaded = useMemo(() => {
        return accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL
            && displaySettingsFetchStatus.status === LoadingStatus.SUCCESSFUL;
    }, [accessTokenFetchStatus, displaySettingsFetchStatus]);

    useEffect(() => {
        if (everythingLoaded) {
            setAppIsReady(true);
        }
    }, [everythingLoaded]);

    if (!appIsReady) {
        return null;
    }

    return (
        <View
            style={styles.rootView}
            // This tells the splash screen to hide immediately. If we'd call this directly after
            //   `setAppIsReady`, then a blank screen briefly flashes while the app is
            //   loading its initial state and rendering its first pixels. So instead,
            //   we hide the splash screen once we know the root view has already
            //   performed layout. The NavigationContainer's onReady doesn't work as an alternative.
            //   Based on: https://docs.expo.dev/versions/v46.0.0/sdk/splash-screen/
            onLayout={SplashScreen.hideAsync}>
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
        </View>
    );
};

const App = () => {
    return (
        <ReduxProvider store={Store}>
            <ReduxProvidedApp />
        </ReduxProvider>
    );
};

const styles = StyleSheet.create({
    rootView: {
        // Without flex 1 the screen would remain empty
        //   See: https://stackoverflow.com/a/72410810
        flex: 1,
    },
});

// Necessary for expo to work correctly:
// eslint-disable-next-line import/no-default-export
export default App;
