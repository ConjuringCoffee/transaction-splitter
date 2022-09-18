import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';

interface Props {
    memo: string | null | undefined,
    triggerMemoDisplay: (memo: string) => void,
}

const ICON_DISPLAY_MEMO = 'information-outline';

export const MemoDataTableCell = (props: Props) => {
    if (props.memo) {
        return (
            <View style={styles.container}>
                <IconButton
                    icon={ICON_DISPLAY_MEMO}
                    onPress={() => {
                        if (!props.memo) {
                            throw new Error('Impossible to get here if memo is not set');
                        }
                        props.triggerMemoDisplay(props.memo);
                    }} />
            </View>
        );
    } else {
        return (<DataTable.Cell numeric> </DataTable.Cell>);
    }
};

const styles = StyleSheet.create({
    // Replicated the style used by the DataTable.Cell:
    // https://github.com/callstack/react-native-paper/blob/5efd68ddbed950b8163ff6b58110e05f9885275c/src/components/DataTable/DataTableCell.tsx#L77
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
