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

export const AccountSelect = (props: Props) => {
    const accountIdentifiers = concatenateIdentifiers(props.accounts);

    useEffect(() => {
        if (props.selectedAccountId === undefined || props.accounts.findIndex((e) => e.id === props.selectedAccountId) === -1) {
            props.onAccountSelect(props.accounts[0].id);
        }
    }, [accountIdentifiers, props]);

    const onSelect = (newIndexPath: IndexPath | IndexPath[]) => {
        if (!(newIndexPath instanceof IndexPath)) {
            throw new Error('Unexpected type of IndexPath');
        }
        props.onAccountSelect(props.accounts[newIndexPath.row].id);
    };

    let index = 0;

    if (props.selectedAccountId !== undefined) {
        index = props.accounts.findIndex((e) => e.id === props.selectedAccountId);

        if (index === -1) {
            index = 0;
        }
    }

    const indexPath = new IndexPath(index);
    const displayValue = props.accounts[indexPath.row].name;

    return (
        <Select
            label={props.label}
            value={displayValue}
            selectedIndex={indexPath}
            onSelect={(newIndexPath) => onSelect(newIndexPath)}>
            {props.accounts.map(renderOption)}
        </Select>
    );
};
