import { Button, Card, Input } from '@ui-kitten/components';
import React, { useState, useEffect } from 'react';
import { LoadingComponent } from '../../Component/LoadingComponent';
import { getAccessTokenFromKeychain, saveAccessTokenToKeychain } from '../../Helper/AccessTokenHelper';

export const AccessTokenScreen = () => {
    const [isLoadingAccessToken, setLoadingAccessToken] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>('');

    useEffect(() => {
        setLoadingAccessToken(true);

        getAccessTokenFromKeychain()
            .then((password) => {
                setAccessToken(password);
                setLoadingAccessToken(false);
            }).catch((error) => {
                console.error(error);
                setLoadingAccessToken(false);
            });
    }, []);

    return (
        <Card>
            {!isLoadingAccessToken
                ? <>
                    <Input
                        placeholder="YNAB Personal Access Token"
                        onChangeText={(text) => setAccessToken(text)}
                        defaultValue={accessToken}
                    />
                    <Button
                        onPress={() => {
                            saveAccessTokenToKeychain(accessToken).catch((error) => console.error(error));
                        }}>
                        Set keychain
                    </Button>
                </>
                : <LoadingComponent />}
        </Card>
    );
};
