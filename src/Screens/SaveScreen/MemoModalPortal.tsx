import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Modal, useTheme, Text } from 'react-native-paper';

type Props = {
    visible: boolean,
    toggleVisible: () => void,
    memo: string,
}

export const MemoModalPortal = (props: Props) => {
    const theme = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            padding: 20,
            alignSelf: 'center',
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.background,
        },
    }), [theme]);

    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.toggleVisible}
                contentContainerStyle={styles.modalContainer}
            >
                <Text>{props.memo}</Text>
            </Modal>
        </Portal>
    );
};
