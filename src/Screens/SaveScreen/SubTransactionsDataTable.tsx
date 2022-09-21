import React, { useCallback } from 'react';
import { View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { SaveSubTransaction } from 'ynab';
import { MemoModalPortal } from './MemoModalPortal';
import { SubTransactionDataTableRow } from './SubTransactionDataTableRow';

interface Props {
    budgetId: string,
    subTransactions: SaveSubTransaction[],
}

export const SubTransactionsDataTable = (props: Props) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [memoToDisplay, setMemoToDisplay] = React.useState('');

    const toggleModalVisible = useCallback(
        () => setModalVisible(!modalVisible),
        [modalVisible],
    );

    const renderRow = (subTransaction: SaveSubTransaction, index: number) => (
        <SubTransactionDataTableRow
            key={index}
            budgetId={props.budgetId}
            subTransaction={subTransaction}
            triggerMemoDisplay={(memo) => {
                setMemoToDisplay(memo);
                toggleModalVisible();
            }}
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
                    <DataTable.Title numeric>Memo</DataTable.Title>
                </DataTable.Header>
                {props.subTransactions.map(renderRow)}
            </DataTable>
        </View>
    );
};

