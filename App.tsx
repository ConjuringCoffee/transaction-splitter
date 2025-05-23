import React, { } from 'react';
import 'react-native-gesture-handler';
import { LogBox, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AppNavigator } from './src/Navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Provider as ReduxProvider } from 'react-redux';
import { Store } from './src/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import { de, registerTranslation } from 'react-native-paper-dates';
import { useTheme } from './src/Hooks/useTheme';
import { ScreenNames } from './src/Navigation/ScreenNames';
import { InitialFetchStatus, useInitialFetchStatus } from './src/Hooks/useInitialFetchStatus';

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
    const [theme] = useTheme();

    const [initialFetchStatus] = useInitialFetchStatus();

    if (initialFetchStatus === InitialFetchStatus.UNKNOWN) {
        return null;
    }

    return (
        <View
            style={styles.rootView}
            // This tells the splash screen to hide immediately. If we'd call this in a
            //   `useEffect`, then a blank screen briefly flashes while the app is
            //   loading its initial state and rendering its first pixels. So instead,
            //   we hide the splash screen once we know the root view has already
            //   performed layout. The NavigationContainer's onReady doesn't work as an alternative.
            //   Based on: https://docs.expo.dev/versions/v46.0.0/sdk/splash-screen/
            onLayout={SplashScreen.hideAsync}
        >
            <KeyboardAvoidingView
                // This view serves two purposes:
                // 1. When an input is focused, the view automatically scrolls to make the focused input visible.
                // 2. When the keyboard is open, the view automatically resizes so that scrolling to the very bottom is still possible.
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Taken directly from the React Native documentation
                style={styles.keyboardAvoidingView}
            >
                <PaperProvider theme={theme} >
                    <NavigationContainer theme={theme} >
                        {/* StatusBar is required to fix it being a white bar without elements in EAS build */}
                        <StatusBar />
                        <AppNavigator
                            initialRouteName={initialFetchStatus === InitialFetchStatus.READY ? ScreenNames.SPLITTING_SCREEN : ScreenNames.INITIAL_SCREEN}
                        />
                    </NavigationContainer>
                </PaperProvider>
            </KeyboardAvoidingView>
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
    keyboardAvoidingView: {
        flex: 1,
    },
});

// Necessary for expo to work correctly:
// eslint-disable-next-line import/no-default-export
export default App;
