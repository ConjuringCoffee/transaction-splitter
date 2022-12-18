import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';

interface Props {
    children: React.ReactNode,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const AppBarMoreMenu = ({ setVisible, ...props }: Props) => {
    const theme = useTheme();

    const show = useCallback(
        () => setVisible(true),
        [setVisible],
    );

    const dismiss = useCallback(
        () => setVisible(false),
        [setVisible],
    );

    return (
        <Menu
            visible={props.visible}
            onDismiss={dismiss}
            anchor={
                <Appbar.Action
                    icon={ICON_MORE}
                    onPress={show}
                    // The usual color from the Appbar isn't transferred to this action
                    color={theme.colors.textOnAppBar}
                />
            }
        >
            {props.children}
        </Menu >);
};
