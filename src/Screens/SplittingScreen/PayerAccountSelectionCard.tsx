import { Card } from '@ui-kitten/components';
import React from 'react';
import { Account } from '../../YnabApi/YnabApiWrapper';
import AccountSelect from '../../Component/AccountSelect';

interface Props {
    elegibleAccounts: Account[],
    accountId?: string,
    setAccountId: (id: string) => void
}

const PayerAccountSelectionCard = (props: Props) => {
    return (
        <Card>
            <AccountSelect
                label='Payer account'
                accounts={props.elegibleAccounts}
                selectedAccountId={props.accountId}
                onAccountSelect={(id) => props.setAccountId(id)} />
        </Card>);
};

export default PayerAccountSelectionCard;
