import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../../redux/features/accessToken/accessTokenSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { AccessTokenInput } from './AccessTokenInput';
import { useNavigateBack } from '../../../Hooks/useNavigateBack';
import { useConnectionTest } from '../../../Hooks/useConnectionTest';
import { useThrowingDispatch } from '../../../Hooks/useThrowingDispatch';
import { useNavigationSettings } from '../../../Hooks/useNavigationSettings';
import { useTheme } from '../../../Hooks/useTheme';

type ScreenName = 'Access Token';

const SCREEN_TITLE = 'Access Token';

const ICON_SAVE = 'check';
const ICON_CONNECTION_SUCCESS = 'check';
const ICON_CONNECTION_ERROR = 'alert-circle';

export const AccessTokenScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const throwingDispatch = useThrowingDispatch();
    const accessToken = useAppSelector(selectAccessToken);
    const [enteredToken, setEnteredToken] = useState<string>(accessToken);
    const [connectionStatus, testConnection] = useConnectionTest();
    const [navigateBack] = useNavigateBack(navigation);
    const [theme] = useTheme();

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_SAVE}
                iconColor={theme.colors.onPrimary}
                onPress={async () => {
                    try {
                        await throwingDispatch(saveAccessToken(enteredToken));
                        navigateBack();
                    } catch {
                        Alert.alert('Error', 'Could not save. Please try again.');
                    }
                }}
            />
        ),
        [throwingDispatch, enteredToken, navigateBack, theme],
    );

    useNavigationSettings({
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
        <View style={{ padding: theme.spacing, gap: theme.spacing }}>
            <AccessTokenInput
                token={enteredToken}
                setToken={setEnteredToken}
                connectionStatus={connectionStatus}
            />
            <Button
                mode='contained'
                loading={connectionStatus.status === LoadingStatus.LOADING}
                icon={iconForButton}
                onPress={() => testConnection(enteredToken)}
            >
                    Test connection
            </Button>
        </View>
    );
};
