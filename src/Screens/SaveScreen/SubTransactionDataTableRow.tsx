import React, { useMemo } from 'react';
import { DataTable } from 'react-native-paper';
import { SaveSubTransaction } from 'ynab';
import { convertApiAmountToHumanAmount } from '../../Helper/AmountHelper';
import { useAmountConversion } from '../../Hooks/useAmountConversion';
import { selectActiveAccounts, selectCategories } from '../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { MemoDataTableCell } from './MemoDataTableCell';
import { MultiLineTextDataTableCellView } from './MultiLineTextDataTableCellView';

interface Props {
    budgetId: string,
    subTransaction: SaveSubTransaction,
    displayMemoCell: boolean,
    triggerMemoDisplay: (memo: string) => void,
}

export const SubTransactionDataTableRow = ({ budgetId, subTransaction, displayMemoCell, triggerMemoDisplay }: Props) => {
    const categories = useAppSelector((state) => selectCategories(state, budgetId));
    const accounts = useAppSelector((state) => selectActiveAccounts(state, budgetId));
    const [, convertNumberToText] = useAmountConversion();

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
    const humanAmountText = convertNumberToText(humanAmount);

    return (
        <DataTable.Row>
            <MultiLineTextDataTableCellView text={targetName} />
            <DataTable.Cell numeric>
                {humanAmountText}
            </DataTable.Cell>
            {displayMemoCell
                ? (
                    <MemoDataTableCell
                        memo={subTransaction.memo}
                        triggerMemoDisplay={triggerMemoDisplay}
                    />
                )
                : null
            }
        </DataTable.Row>);
};
