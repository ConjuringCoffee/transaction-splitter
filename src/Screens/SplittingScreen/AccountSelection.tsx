import React, { useCallback, useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { Account } from '../../YnabApi/YnabApiWrapper';

type Props = {
    accounts: Account[],
    selectedAccountId: string,
    setSelectedAccountId: (id: string) => void,
}

export const AccountSelection = ({ accounts, selectedAccountId, setSelectedAccountId }: Props) => {
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
        <View style={{ gap: 4 }}>
            <Text variant='labelMedium'>Payer account</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {accounts.map((account) => (
                    <Chip
                        key={account.id}
                        selected={account.id === selectedAccountId}
                        onPress={() => onPress(account.id)}
                    >
                        {account.name}
                    </Chip>
                ))}
            </View>
        </View>
    );
};
