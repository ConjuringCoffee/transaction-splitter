import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';

type Props = {
    children: React.ReactNode,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const AppBarMoreMenu = ({ setVisible, ...props }: Props) => {
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
                />
            }
        >
            {props.children}
        </Menu >);
};
