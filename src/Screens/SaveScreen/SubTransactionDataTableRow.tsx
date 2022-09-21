import React from 'react';
import { DataTable } from 'react-native-paper';
import { SaveSubTransaction } from 'ynab';
import { convertApiAmountToHumanAmount, convertAmountToText } from '../../Helper/AmountHelper';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { selectActiveAccounts, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../redux/hooks';
import { MemoDataTableCell } from './MemoDataTableCell';

interface Props {
    budgetId: string,
    subTransaction: SaveSubTransaction,
    triggerMemoDisplay: (memo: string) => void,
}

export const SubTransactionDataTableRow = (props: Props) => {
    const categories = useAppSelector((state) => selectCategories(state, props.budgetId));
    const accounts = useAppSelector((state) => selectActiveAccounts(state, props.budgetId));
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    let targetName: string | undefined = undefined;

    if (props.subTransaction.category_id != undefined) {
        targetName = categories[props.subTransaction.category_id].name;
    } else if (props.subTransaction.payee_id != undefined) {
        targetName = accounts.find((account) => account.transferPayeeID === props.subTransaction.payee_id)?.name;
    }

    if (!targetName) {
        throw new Error('Unable to determine target of SubTransaction');
    }

    const humanAmount = convertApiAmountToHumanAmount(props.subTransaction.amount);
    const humanAmountText = convertAmountToText(humanAmount, numberFormatSettings);

    return (
        <DataTable.Row>
            <DataTable.Cell>{targetName}</DataTable.Cell>
            <DataTable.Cell numeric>{humanAmountText}</DataTable.Cell>
            <MemoDataTableCell
                memo={props.subTransaction.memo}
                triggerMemoDisplay={props.triggerMemoDisplay}
            />
        </DataTable.Row>);
};
