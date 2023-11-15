import React, { useCallback } from 'react';
import { DataTable, IconButton } from 'react-native-paper';
import { DataTableCellView } from './DataTableCellView';

type Props = {
    memo: string | null | undefined,
    triggerMemoDisplay: (memo: string) => void,
}

const ICON_DISPLAY_MEMO = 'information-outline';

export const MemoDataTableCell = ({ memo, triggerMemoDisplay }: Props) => {
    const triggerDisplay = useCallback(
        () => {
            if (!memo) {
                throw new Error('Calling this function is not supported if no memo is set');
            }

            triggerMemoDisplay(memo);
        },
        [triggerMemoDisplay, memo],
    );

    if (memo) {
        return (
            <DataTableCellView alignRight={true}>
                <IconButton
                    icon={ICON_DISPLAY_MEMO}
                    onPress={triggerDisplay}
                />
            </DataTableCellView>
        );
    } else {
        return (<DataTable.Cell numeric> </DataTable.Cell>);
    }
};
