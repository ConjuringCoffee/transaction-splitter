import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
    children: ReactNode
}

export const CustomScrollView = ({ children }: Props) => {
    return (
        <ScrollView
            // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open,
            // see: https://stackoverflow.com/a/57941568
            keyboardShouldPersistTaps='handled'
        >
            {children}
        </ScrollView>
    );
};
