import React from 'react';
import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { LogBox } from 'react-native';
import AppNavigator from './src/Helper/Navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';

LogBox.ignoreLogs([
    // Ignore this because we don't use state persistence or deep screen linking,
    // see https://stackoverflow.com/questions/60954742/how-to-pass-parent-function-to-child-screen-in-react-navigation-5
    'Non-serializable values were found in the navigation state',
]);

const App = () => {
    return (
        <PaperProvider>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </ApplicationProvider>
        </PaperProvider>
    );
};

export default App;
