import React from 'react';
import { Platform } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';

interface Props {
    children: React.ReactNode,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const AppBarMoreMenu = (props: Props) => {
    const theme = useTheme();

    return (
        <Menu
            visible={props.visible}
            onDismiss={() => props.setVisible(false)}
            anchor={
                <Appbar.Action
                    icon={ICON_MORE}
                    onPress={() => props.setVisible(true)}
                    // The usual color from the Appbar isn't transferred to this action
                    color={theme.colors.textOnAppBar} />
            } >
            {props.children}
        </Menu >);
};
