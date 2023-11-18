import { useCallback } from 'react';
import { List } from 'react-native-paper';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { useAutomaticConnectionTest } from '../../Hooks/useAutomaticConnectionTest';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';

type Props<T extends keyof StackParameterList> = {
    navigation: MyStackNavigationProp<T>,
}

const ICON_CONNECTION_OK = 'check-circle-outline';
const ICON_CONNECTION_NOT_OK = 'checkbox-blank-circle-outline';

export const AccessTokenListItem = <T extends keyof StackParameterList>({ navigation }: Props<T>) => {
    const [connectionStatus] = useAutomaticConnectionTest();

    const navigateToAccessTokenScreen = useCallback(
        () => {
            navigation.navigate(ScreenNames.ACCESS_TOKEN_SCREEN);
        },
        [navigation],
    );

    const listIcon = useCallback(
        (props: object) => {
            const icon = connectionStatus.status === LoadingStatus.SUCCESSFUL ? ICON_CONNECTION_OK : ICON_CONNECTION_NOT_OK;
            return <List.Icon {...props} icon={icon} />;
        },
        [connectionStatus],
    );

    return (
        <List.Item
            title='Connect YNAB account'
            left={listIcon}
            onPress={navigateToAccessTokenScreen}
        />
    );
};
