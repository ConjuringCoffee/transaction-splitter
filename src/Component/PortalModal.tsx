import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';

type Props = {
    visible: boolean,
    toggleVisible: () => void,
    children: React.ReactNode,
}

export const PortalModal = ({ visible, toggleVisible, children }: Props) => {
    const theme = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            padding: 10,
            margin: 20,
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.background,
        },
    }), [theme]);

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={toggleVisible}
                contentContainerStyle={styles.modalContainer}
            >
                {children}
            </Modal>
        </Portal>
    );
};
