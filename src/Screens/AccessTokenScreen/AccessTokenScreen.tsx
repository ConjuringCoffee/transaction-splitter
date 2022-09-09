import { Button, Input } from '@ui-kitten/components';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { fetchAccessToken, saveAccessToken, selectAccessToken, selectAccessTokenFetchStatus } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export const AccessTokenScreen = () => {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(selectAccessToken);
    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);

    const [enteredToken, setEnteredToken] = useState<string>('');

    useEffect(() => {
        if (accessTokenFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchAccessToken());
        }
    }, [accessTokenFetchStatus, dispatch, accessToken]);

    return (
        <View>
            {accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL
                ? <>
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
                </>
                : <ActivityIndicator />}
        </View>
    );
};
