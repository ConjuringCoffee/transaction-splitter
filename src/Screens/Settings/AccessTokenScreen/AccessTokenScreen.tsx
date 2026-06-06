import { useCallback, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { API } from 'ynab';
import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../../redux/features/accessToken/accessTokenSlice';
import { deleteProfile, saveProfile, selectProfile } from '../../../redux/features/profile/profileSlice';
import { deleteAllCategoryCombos } from '../../../redux/features/categoryCombos/categoryCombosSlice';
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
    const profile = useAppSelector(selectProfile);
    const [enteredToken, setEnteredToken] = useState<string>(accessToken);
    const [connectionStatus, testConnection] = useConnectionTest();
    const [navigateBack] = useNavigateBack(navigation);
    const [theme] = useTheme();

    const onSavePress = useCallback(async () => {
        let newUserId: string;
        try {
            const response = await new API(enteredToken).user.getUser();
            newUserId = response.data.user.id;
        } catch {
            Alert.alert('Invalid Token', 'Could not connect with this token. Please test the connection first.');
            return;
        }

        if (profile?.ynabUserId !== undefined && newUserId !== profile.ynabUserId) {
            Alert.alert(
                'Different YNAB Account',
                'This token belongs to a different YNAB account. All profiles and category combos will be deleted. Continue?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Continue',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await throwingDispatch(deleteAllCategoryCombos());
                                await throwingDispatch(deleteProfile());
                                await throwingDispatch(saveAccessToken(enteredToken));
                                navigateBack();
                            } catch {
                                Alert.alert('Error', 'Could not save. Please try again.');
                            }
                        },
                    },
                ],
            );
            return;
        }

        try {
            await throwingDispatch(saveAccessToken(enteredToken));
            if (profile !== null) {
                await throwingDispatch(saveProfile({ ...profile, ynabUserId: newUserId }));
            }
            navigateBack();
        } catch {
            Alert.alert('Error', 'Could not save. Please try again.');
        }
    }, [throwingDispatch, enteredToken, profile, navigateBack]);

    const navigationBarAddition = useMemo(
        () => (
            <Appbar.Action
                icon={ICON_SAVE}
                iconColor={theme.colors.onPrimary}
                onPress={onSavePress}
            />
        ),
        [onSavePress, theme],
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
