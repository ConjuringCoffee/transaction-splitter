import React, { useCallback, useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import { Chip } from 'react-native-paper';
import { Account } from '../../YnabApi/YnabApiWrapper';
import { useTheme } from '../../Hooks/useTheme';

type Props = {
    accounts: Account[],
    selectedAccountId: string,
    setSelectedAccountId: (id: string) => void,
}

export const AccountSelection = ({ accounts, selectedAccountId, setSelectedAccountId }: Props) => {
    const [theme] = useTheme();

    useEffect(() => {
        if (!accounts.some((account) => account.id === selectedAccountId)) {
            setSelectedAccountId(accounts[0].id);
        }
    }, [accounts, selectedAccountId, setSelectedAccountId]);

    const onPress = useCallback((id: string) => {
        Keyboard.dismiss();
        setSelectedAccountId(id);
    }, [setSelectedAccountId]);

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {accounts.map((account) => (
                <Chip
                    key={account.id}
                    mode='outlined'
                    selected={account.id === selectedAccountId}
                    style={account.id === selectedAccountId ? { backgroundColor: theme.colors.secondaryContainer } : undefined}
                    onPress={() => onPress(account.id)}
                >
                    {account.name}
                </Chip>
            ))}
        </View>
    );
};
