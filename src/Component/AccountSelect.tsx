import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import React, { useEffect } from 'react';
import { Account } from '../YnabApi/YnabApiWrapper';

interface Props {
    accounts: Array<Account>,
    selectedAccountId?: string,
    label: string,
    onAccountSelect: (accountID: string) => void
}

const concatenateIdentifiers = (accounts: Array<Account>): string => {
    return accounts.reduce(((result: string, account: Account) => {
        return `${result}${account.id};`;
    }), '');
};

const renderOption = (account: Account) => (
    <SelectItem
        title={account.name}
        key={account.id} />
);

export const AccountSelect = ({ selectedAccountId, accounts, onAccountSelect, label }: Props) => {
    const accountIdentifiers = concatenateIdentifiers(accounts);

    useEffect(() => {
        if (selectedAccountId === undefined || accounts.findIndex((e) => e.id === selectedAccountId) === -1) {
            onAccountSelect(accounts[0].id);
        }
    }, [accountIdentifiers, selectedAccountId, accounts, onAccountSelect]);

    const onSelect = (newIndexPath: IndexPath | IndexPath[]) => {
        if (!(newIndexPath instanceof IndexPath)) {
            throw new Error('Unexpected type of IndexPath');
        }
        onAccountSelect(accounts[newIndexPath.row].id);
    };

    let index = 0;

    if (selectedAccountId !== undefined) {
        index = accounts.findIndex((e) => e.id === selectedAccountId);

        if (index === -1) {
            index = 0;
        }
    }

    const indexPath = new IndexPath(index);
    const displayValue = accounts[indexPath.row].name;

    return (
        <Select
            label={label}
            value={displayValue}
            selectedIndex={indexPath}
            onSelect={(newIndexPath) => onSelect(newIndexPath)}>
            {accounts.map(renderOption)}
        </Select>
    );
};
