import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '../Hooks/useTheme';
import { RefreshControlProps } from 'react-native';

type Props = {
    children: ReactNode,
    refreshControl?: React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>>,
}

export const CustomScrollView = (props: Props) => {
    const [theme] = useTheme();

    return (
        <ScrollView
            // keyboardShouldPersistTaps is needed to allow pressing buttons when keyboard is open,
            // see: https://stackoverflow.com/a/57941568
            keyboardShouldPersistTaps='handled'
            refreshControl={props.refreshControl}
            style={{ padding: theme.spacing }}
        >
            {props.children}
        </ScrollView>
    );
};
