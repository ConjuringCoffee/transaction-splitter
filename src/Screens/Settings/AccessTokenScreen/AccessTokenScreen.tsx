import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../../redux/features/accessToken/accessTokenSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { AccessTokenInput } from './AccessTokenInput';
import { useNavigateBack } from '../../../Hooks/useNavigateBack';
import { useConnectionTest } from '../../../Hooks/useConnectionTest';
import { useAppDispatch } from '../../../Hooks/useAppDispatch';
import { useNavigationBar } from '../../../Hooks/useNavigationBar';

type ScreenName = 'Access Token';

const SCREEN_TITLE = 'Access Token';

const ICON_SAVE = 'check';
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

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_SAVE}
                onPress={() => {
                    dispatch(saveAccessToken(enteredToken));
                    navigateBack();
                }}
            />
        ),
        [dispatch, enteredToken, navigateBack],
    );

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAddition,
    });

    const iconForButton = useMemo(
        (): string | undefined => {
            switch (connectionStatus.status) {
                case LoadingStatus.SUCCESSFUL:
                    return ICON_CONNECTION_SUCCESS;
                case LoadingStatus.ERROR:
                    return ICON_CONNECTION_ERROR;
                default:
                    return undefined;
            }
        },
        [connectionStatus.status],
    );

    return (
        <View>
            <AccessTokenInput
                token={enteredToken}
                setToken={setEnteredToken}
                connectionStatus={connectionStatus}
            />
            <Button
                loading={connectionStatus.status === LoadingStatus.LOADING}
                icon={iconForButton}
                onPress={() => testConnection(enteredToken)}
            >
                Test connection
            </Button>
        </View >
    );
};
