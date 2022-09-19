import React from 'react';
import { Text } from 'react-native-paper';
import { DataTableCellView } from './DataTableCellView';

interface Props {
    text: string,
    numberOfLines: number,
}

export const MultiLineDataTableCell = (props: Props) => {
    return (
        <DataTableCellView>
            <Text numberOfLines={props.numberOfLines}>{props.text}</Text>
        </DataTableCellView>
    );
};
