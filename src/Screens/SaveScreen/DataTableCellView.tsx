import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children: React.ReactNode,
    alignRight?: boolean,
}

export const DataTableCellView = (props: Props) => {
    return (
        <View style={[styles.view, props.alignRight && styles.alignRight]}>
            {props.children}
        </View>
    );
};

// Replicated the style used by the DataTable.Cell:
// https://github.com/callstack/react-native-paper/blob/5efd68ddbed950b8163ff6b58110e05f9885275c/src/components/DataTable/DataTableCell.tsx#L77
const styles = StyleSheet.create({
    view: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    alignRight: {
        justifyContent: 'flex-end',
    },
});
