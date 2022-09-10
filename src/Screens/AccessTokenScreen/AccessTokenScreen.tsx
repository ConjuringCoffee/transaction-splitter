import { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { API } from 'ynab';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { AccessTokenInput } from './AccessTokenInput';
import { useNavigateBack } from '../../Hooks/useNavigateBack';

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
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: LoadingStatus.IDLE });
    const [navigateBack] = useNavigateBack(navigation);

    const testConnection = async () => {
        setConnectionStatus({ status: LoadingStatus.LOADING });

        try {
            await new API(enteredToken).user.getUser();
            setConnectionStatus({ status: LoadingStatus.SUCCESSFUL });
        } catch (error: any) {
            setConnectionStatus({
                status: LoadingStatus.ERROR,
                error: {
                    id: error.error.id,
                    detail: error.error.detail,
                },
            });
        }
    };

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
                onPress={testConnection} >
                Test connection
            </Button>
        </View >
    );
};
