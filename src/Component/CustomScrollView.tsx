import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

export const CustomScrollView = ({ children }) => {
    return (
        // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open,
        // see https://stackoverflow.com/questions/57941342/button-cant-be-clicked-while-keyboard-is-visible-react-native
        <ScrollView keyboardShouldPersistTaps='handled'>
            {children}
        </ScrollView>
    );
};
