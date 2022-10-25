import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { SaveSubTransaction } from 'ynab';
import { MemoModalPortal } from './MemoModalPortal';
import { SubTransactionDataTableRow } from './SubTransactionDataTableRow';

interface Props {
    budgetId: string,
    subTransactions: SaveSubTransaction[],
}

export const SubTransactionsDataTable = ({ budgetId, subTransactions }: Props) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [memoToDisplay, setMemoToDisplay] = React.useState('');

    const memoFound = useMemo(
        () => subTransactions.some((subTransaction) => subTransaction.memo),
        [subTransactions],
    );

    const toggleModalVisible = useCallback(
        () => setModalVisible(!modalVisible),
        [modalVisible],
    );

    const triggerMemoDisplay = useCallback(
        (memo: string) => {
            setMemoToDisplay(memo);
            toggleModalVisible();
        },
        [toggleModalVisible],
    );

    const renderRow = (subTransaction: SaveSubTransaction, index: number) => (
        <SubTransactionDataTableRow
            key={index}
            budgetId={budgetId}
            subTransaction={subTransaction}
            displayMemoCell={memoFound}
            triggerMemoDisplay={triggerMemoDisplay}
        />
    );

    return (
        <View>
            <MemoModalPortal
                visible={modalVisible}
                toggleVisible={toggleModalVisible}
                memo={memoToDisplay}
            />
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Target</DataTable.Title>
                    <DataTable.Title numeric>Amount</DataTable.Title>
                    {memoFound
                        ? <DataTable.Title numeric>Memo</DataTable.Title>
                        : null
                    }
                </DataTable.Header>
                {subTransactions.map(renderRow)}
            </DataTable>
        </View>
    );
};

