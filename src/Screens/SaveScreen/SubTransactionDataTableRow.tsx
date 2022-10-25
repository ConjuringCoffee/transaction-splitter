import React, { useMemo } from 'react';
import { DataTable } from 'react-native-paper';
import { SaveSubTransaction } from 'ynab';
import { convertApiAmountToHumanAmount, convertAmountToText } from '../../Helper/AmountHelper';
import { selectNumberFormatSettings } from '../../redux/features/displaySettings/displaySettingsSlice';
import { selectActiveAccounts, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../redux/hooks';
import { MemoDataTableCell } from './MemoDataTableCell';
import { MultiLineTextDataTableCellView } from './MultiLineTextDataTableCellView';

interface Props {
    budgetId: string,
    subTransaction: SaveSubTransaction,
    triggerMemoDisplay: (memo: string) => void,
}

export const SubTransactionDataTableRow = ({ budgetId, subTransaction, triggerMemoDisplay }: Props) => {
    const categories = useAppSelector((state) => selectCategories(state, budgetId));
    const accounts = useAppSelector((state) => selectActiveAccounts(state, budgetId));
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    const targetName = useMemo(() => {
        let result: string | undefined = undefined;

        if (subTransaction.category_id != undefined) {
            result = categories[subTransaction.category_id].name;
        } else if (subTransaction.payee_id != undefined) {
            result = accounts.find((account) => account.transferPayeeID === subTransaction.payee_id)?.name;
        }

        if (!result) {
            throw new Error('Unable to determine target of SubTransaction');
        }

        return result;
    }, [subTransaction, categories, accounts]);

    const humanAmount = convertApiAmountToHumanAmount(subTransaction.amount);
    const humanAmountText = convertAmountToText(humanAmount, numberFormatSettings);

    return (
        <DataTable.Row>
            <MultiLineTextDataTableCellView text={targetName} />
            <DataTable.Cell numeric>
                {humanAmountText}
            </DataTable.Cell>
            <MemoDataTableCell
                memo={subTransaction.memo}
                triggerMemoDisplay={triggerMemoDisplay}
            />
        </DataTable.Row>);
};
