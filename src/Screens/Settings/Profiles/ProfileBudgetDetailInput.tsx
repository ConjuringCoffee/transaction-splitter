import React from 'react';
import { Checkbox, HelperText, List, RadioButton, TextInput } from 'react-native-paper';
import { selectActiveAccounts, selectBudgetById } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { Account } from '../../../YnabApi/YnabApiWrapper';

interface Props {
    budgetId: string,
    displayName?: string,
    setDisplayName: (name: string) => void,
    debtorAccountId: string,
    setDebtorAccountId: (id: string) => void,
    elegibleAccountIds: string[],
    toggleAccountElegible: (id: string) => void,
}

export const ProfileBudgetDetailInput = (props: Props) => {
    const budget = useAppSelector((state) => selectBudgetById(state, props.budgetId));
    const activeAccounts = useAppSelector((state) => selectActiveAccounts(state, props.budgetId));

    const renderRadioButton = (account: Account) => (
        <RadioButton.Item
            key={account.id}
            value={account.id}
            label={account.name}
        />
    );

    const renderCheckbox = (account: Account) => (
        <Checkbox.Item
            key={account.id}
            label={account.name}
            status={props.elegibleAccountIds.some((id) => id === account.id) ? 'checked' : 'unchecked'}
            onPress={() => props.toggleAccountElegible(account.id)}
            disabled={props.debtorAccountId === account.id}
        />
    );

    return (
        <>
            <TextInput
                label={'Displayed name'}
                value={props.displayName}
                placeholder={budget.name}
                onChangeText={props.setDisplayName}
            />
            <HelperText type='info'>
                Leave empty to use the budget&apos;s name
            </HelperText>
            <List.Subheader>Debtor account</List.Subheader>
            <RadioButton.Group
                value={props.debtorAccountId}
                onValueChange={props.setDebtorAccountId}
            >
                {activeAccounts.map(renderRadioButton)}
            </RadioButton.Group>
            <List.Subheader>Elegible accounts</List.Subheader>
            {activeAccounts.map(renderCheckbox)}
        </>
    );
};
