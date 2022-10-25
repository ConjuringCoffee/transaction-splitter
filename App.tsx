import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { LogBox, View, StyleSheet } from 'react-native';
import { AppNavigator } from './src/Navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from './src/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { de, registerTranslation } from 'react-native-paper-dates';
import { useInitialFetch } from './src/Hooks/useInitialFetch';
import { useTheme } from './src/Hooks/useTheme';

LogBox.ignoreLogs([
    // Ignore this because we don't use state persistence or deep screen linking,
    // see https://stackoverflow.com/questions/60954742/how-to-pass-parent-function-to-child-screen-in-react-navigation-5
    'Non-serializable values were found in the navigation state',
]);

// Any translations used by the date picker must be registered beforehand
registerTranslation('de', de);

// Keep the splash screen visible while app is being prepared
SplashScreen.preventAutoHideAsync();

const ReduxProvidedApp = () => {
    const [everythingLoaded] = useInitialFetch();
    const [theme] = useTheme();
    const [appIsReady, setAppIsReady] = useState(false);

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
            onLayout={SplashScreen.hideAsync}
        >
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    {/* StatusBar is required to fix it being a white bar without elements in EAS build */}
                    <StatusBar style={theme.statusBarColorScheme} />
                    <AppNavigator />
                </NavigationContainer>
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
