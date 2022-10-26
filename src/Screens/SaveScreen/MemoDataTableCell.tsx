import React from 'react';
import { DataTable, IconButton } from 'react-native-paper';
import { DataTableCellView } from './DataTableCellView';

interface Props {
    memo: string | null | undefined,
    triggerMemoDisplay: (memo: string) => void,
}

const ICON_DISPLAY_MEMO = 'information-outline';

export const MemoDataTableCell = (props: Props) => {
    if (props.memo) {
        return (
            <DataTableCellView alignRight={true}>
                <IconButton
                    icon={ICON_DISPLAY_MEMO}
                    onPress={() => {
                        if (!props.memo) {
                            throw new Error('Impossible to get here if memo is not set');
                        }
                        props.triggerMemoDisplay(props.memo);
                    }}
                />
            </DataTableCellView>
        );
    } else {
        return (<DataTable.Cell numeric> </DataTable.Cell>);
    }
};
