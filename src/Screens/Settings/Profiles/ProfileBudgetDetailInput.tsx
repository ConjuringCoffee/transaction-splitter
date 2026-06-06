import React from 'react';
import { Chip, HelperText, List, TextInput } from 'react-native-paper';
import { selectActiveAccounts, selectBudgetById } from '../../../redux/features/ynab/ynabSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { Account } from '../../../YnabApi/YnabApiWrapper';
import { View } from 'react-native';
import { useTheme } from '../../../Hooks/useTheme';

type Props = {
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
    const [theme] = useTheme();

    const renderDebtorChip = (account: Account) => (
        <Chip
            key={account.id}
            mode='outlined'
            selected={account.id === props.debtorAccountId}
            style={account.id === props.debtorAccountId ? { backgroundColor: theme.colors.secondaryContainer } : undefined}
            onPress={() => props.setDebtorAccountId(account.id)}
        >
            {account.name}
        </Chip>
    );

    const renderEligibleChip = (account: Account) => (
        <Chip
            key={account.id}
            mode='outlined'
            selected={props.elegibleAccountIds.includes(account.id)}
            style={props.elegibleAccountIds.includes(account.id) ? { backgroundColor: theme.colors.secondaryContainer } : undefined}
            onPress={() => props.toggleAccountElegible(account.id)}
            disabled={props.debtorAccountId === account.id}
        >
            {account.name}
        </Chip>
    );

    return (
        <View style={{ padding: theme.cardPadding, gap: theme.spacing }}>
            <TextInput
                label='Displayed name'
                value={props.displayName}
                placeholder={budget.name}
                onChangeText={props.setDisplayName}
                mode='outlined'
            />
            <HelperText type='info'>
                Leave empty to use the budget&apos;s name
            </HelperText>
            <List.Subheader>Debtor account</List.Subheader>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing }}>
                {activeAccounts.map(renderDebtorChip)}
            </View>
            <List.Subheader>Eligible accounts</List.Subheader>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing }}>
                {activeAccounts.map(renderEligibleChip)}
            </View>
        </View>
    );
};
