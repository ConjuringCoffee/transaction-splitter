import { List, RadioButton } from 'react-native-paper';
import React, { useCallback, useEffect } from 'react';
import { Account } from '../../YnabApi/YnabApiWrapper';
import { Keyboard } from 'react-native';

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
            value={account.id}
        />
    );

    const onValueChange = useCallback((newValue: string) => {
        Keyboard.dismiss();
        setSelectedAccountId(newValue);
    }, [setSelectedAccountId]);

    useEffect(() => {
        if (!accounts.some((account) => account.id === selectedAccountId)) {
            setSelectedAccountId(accounts[0].id);
        }
    }, [accounts, selectedAccountId, setSelectedAccountId]);

    return (
        <List.Section title='Payer account'>
            <RadioButton.Group
                onValueChange={onValueChange}
                value={selectedAccountId}
            >
                {accounts.map(renderItem)}
            </RadioButton.Group>
        </List.Section>
    );
};
