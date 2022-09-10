import { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { AccessTokenInput } from './AccessTokenInput';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { useConnectionTest } from '../../Hooks/useConnectionTest';

type ScreenName = 'Access Token';

const SCREEN_TITLE = 'Access Token';

const ICON_SAVE = 'content-save';
const ICON_CONNECTION_SUCCESS = 'check';
const ICON_CONNECTION_ERROR = 'alert-circle';

export interface ConnectionStatus {
    status: LoadingStatus,
    error?: {
        id: string,
        detail: string
    }
}

export const AccessTokenScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(selectAccessToken);

    const [enteredToken, setEnteredToken] = useState<string>(accessToken);
    const [connectionStatus, testConnection] = useConnectionTest();
    const [navigateBack] = useNavigateBack(navigation);

    useLayoutEffect(() => {
        const addition = (
            <Appbar.Action
                icon={ICON_SAVE}
                onPress={() => {
                    dispatch(saveAccessToken(enteredToken));
                    navigateBack();
                }} />);

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={addition}
                />
            ),
        });
    }, [navigation, dispatch, enteredToken, navigateBack]);

    return (
        <View>
            <AccessTokenInput
                token={enteredToken}
                setToken={setEnteredToken}
                connectionStatus={connectionStatus} />
            <Button
                loading={connectionStatus.status === LoadingStatus.LOADING}
                icon={connectionStatus.status === LoadingStatus.SUCCESSFUL
                    ? ICON_CONNECTION_SUCCESS
                    : connectionStatus.status === LoadingStatus.ERROR
                        ? ICON_CONNECTION_ERROR
                        : undefined}
                onPress={() => testConnection(enteredToken)} >
                Test connection
            </Button>
        </View >
    );
};
