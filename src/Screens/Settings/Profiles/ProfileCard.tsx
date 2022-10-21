import { Card, CheckBox, Input } from '@ui-kitten/components';
import React from 'react';
import { Account, Budget } from '../../../YnabApi/YnabApiWrapper';
import { AccountSelect } from '../../../Component/AccountSelect';
import { BudgetSelect } from '../../../Component/BudgetSelect';

interface Props {
    budgets: Array<Budget>,
    profileName: string,
    setProfileName: (name: string) => void,
    selectedBudgetId: string,
    setBudgetId: (budgetId: string) => void,
    accounts: Array<Account>,
    selectedDebtorAccountId: string,
    setDebtorAccountId: (accountId: string) => void,
    selectedElegibleAccountIds: Array<string>,
    setElegibleAccountIds: (accountIds: Array<string>) => void
}

export const ProfileCard = (props: Props) => {
    return (
        <Card>
            <Input
                label='Profile name'
                placeholder="Enter profile name"
                value={props.profileName}
                status={props.profileName ? 'basic' : 'danger'}
                onChangeText={(text) => props.setProfileName(text)} />
            <BudgetSelect
                budgets={props.budgets}
                selectedBudgetId={props.selectedBudgetId}
                label='Budget'
                onBudgetSelect={(id) => props.setBudgetId(id)} />
            <AccountSelect
                label='Debtor account'
                accounts={props.accounts}
                selectedAccountId={props.selectedDebtorAccountId}
                onAccountSelect={(id) => props.setDebtorAccountId(id)} />
            {props.accounts.map((account, index) => {
                return (
                    <CheckBox
                        key={index}
                        checked={props.selectedElegibleAccountIds.includes(account.id)}
                        onChange={(checked) => {
                            let newElegibleAccountIds = props.selectedElegibleAccountIds;

                            if (checked) {
                                newElegibleAccountIds.push(account.id);
                            } else {
                                newElegibleAccountIds = newElegibleAccountIds.filter((id) => id !== account.id);
                            }
                            props.setElegibleAccountIds(newElegibleAccountIds);
                        }}>
                        {account.name}
                    </CheckBox>);
            })}
        </Card>
    );
};
