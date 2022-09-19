import React from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { LoadingStatus } from '../../Helper/LoadingStatus';

interface Props {
    saveStatus: LoadingStatus,
    save: () => void,
}

const ICON_DEFAULT = 'content-save';
const ICON_SUCCESS = 'check';
const ICON_ERROR = 'close-circle-outline';

export const SaveFAB = (props: Props) => {
    const icon = getIcon(props.saveStatus);
    const isLoading = props.saveStatus === LoadingStatus.LOADING;

    return (
        <FAB
            icon={icon}
            loading={isLoading}
            style={styles.fab}
            onPress={props.save}
        />
    );
};

const getIcon = (saveStatus: LoadingStatus) => {
    switch (saveStatus) {
        case LoadingStatus.SUCCESSFUL:
            return ICON_SUCCESS;
        case LoadingStatus.ERROR:
            return ICON_ERROR;
        default:
            // No need to handle LoadingStatus.LOADING because the FAB has a dedicated loading function
            return ICON_DEFAULT;
    }
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
