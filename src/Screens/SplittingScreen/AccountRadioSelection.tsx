import { List, RadioButton } from 'react-native-paper';
import React, { useEffect } from 'react';
import { Account } from '../../YnabApi/YnabApiWrapper';

interface Props {
    accounts: Account[],
    selectedAccountId: string,
    setSelectedAccountId: (id: string) => void,
}

export const AccountRadioSelection = ({ accounts, setSelectedAccountId, selectedAccountId }: Props) => {
    const renderItem = (account: Account) => (
        <RadioButton.Item
            key={account.id}
            label={account.name}
            value={account.id} />
    );

    useEffect(() => {
        if (!accounts.some((account) => account.id === selectedAccountId)) {
            setSelectedAccountId(accounts[0].id);
        }
    }, [accounts, selectedAccountId, setSelectedAccountId]);

    return (
        <List.Section title='Payer account'>
            <RadioButton.Group
                onValueChange={setSelectedAccountId}
                value={selectedAccountId}
            >
                {accounts.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
