import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, useTheme, Text } from 'react-native-paper';

interface Props {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    memo: string,
}

export const MemoModalPortal = (props: Props) => {
    const theme = useTheme();

    const hide = () => props.setVisible(false);

    const styles = StyleSheet.create({
        modalContainer: {
            padding: 20,
            alignSelf: 'center',
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.backdrop,
        },
    });

    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={hide}
                contentContainerStyle={styles.modalContainer}
            >
                <Text>{props.memo}</Text>
            </Modal>
        </Portal>
    );
};
