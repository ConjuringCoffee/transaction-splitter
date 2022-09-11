import React from 'react';
import { Platform } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';

interface Props {
    children: React.ReactNode,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

const ICON_MORE = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const AppBarMoreMenu = (props: Props) => {
    return (
        <Menu
            visible={props.visible}
            onDismiss={() => props.setVisible(false)}
            anchor={
                <Appbar.Action
                    icon={ICON_MORE}
                    onPress={() => props.setVisible(true)}
                    // TODO: The usual color from the Appbar isn't transferred to this action and I don't know how to fix it
                    color='white' />
            } >
            {props.children}
        </Menu >);
};
