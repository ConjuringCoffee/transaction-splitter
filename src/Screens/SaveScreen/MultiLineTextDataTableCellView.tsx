import React from 'react';
import { DataTableCellView } from './DataTableCellView';
import { Text } from 'react-native-paper';

interface Props {
    text: string | undefined,
}

export const MultiLineTextDataTableCellView = ({ text }: Props) => {
    return (
        <DataTableCellView>
            <Text numberOfLines={3}>{text}</Text>
        </DataTableCellView>
    );
};
