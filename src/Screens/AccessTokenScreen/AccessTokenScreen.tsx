import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import { Button, Card, Input } from '@ui-kitten/components';
import React, { useState, useEffect } from 'react';
import LoadingComponent from '../../Component/LoadingComponent';
import { getAccessTokenFromKeychain, saveAccessTokenToKeychain } from '../../Helper/AccessTokenHelper';
import { DrawerParameterList } from '../../Helper/Navigation/ScreenParameters';

type MyNavigationProp = DrawerNavigationProp<DrawerParameterList, 'Access Token'>;
type MyRouteProp = RouteProp<DrawerParameterList, 'Access Token'>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

const AccessTokenScreen = (props: Props) => {
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

export default AccessTokenScreen;
