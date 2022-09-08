import { Card } from '@ui-kitten/components';
import { Account } from '../../YnabApi/YnabApiWrapper';
import { AccountSelect } from '../../Component/AccountSelect';

interface Props {
    elegibleAccounts: Account[],
    accountId?: string,
    setAccountId: (id: string) => void
}

export const PayerAccountSelectionCard = (props: Props) => {
    return (
        <Card>
            <AccountSelect
                label='Payer account'
                accounts={props.elegibleAccounts}
                selectedAccountId={props.accountId}
                onAccountSelect={(id) => props.setAccountId(id)} />
        </Card>);
};

