import { Button, Input } from '@ui-kitten/components';
import React, { useState } from 'react';
import { View } from 'react-native';
import { saveAccessToken, selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export const AccessTokenScreen = () => {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(selectAccessToken);

    const [enteredToken, setEnteredToken] = useState<string>('');

    return (
        <View>
            <Input
                placeholder="YNAB Personal Access Token"
                onChangeText={setEnteredToken}
                defaultValue={accessToken}
            />
            <Button
                onPress={() => {
                    dispatch(saveAccessToken(enteredToken));
                }}>
                Set keychain
            </Button>
        </View>
    );
};
