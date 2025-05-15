import { useState } from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { ConnectionStatus } from './AccessTokenScreen';

type Props = {
    token: string,
    setToken: (token: string) => void,
    connectionStatus: ConnectionStatus
}

const ICON_INPUT_HIDDEN = 'eye-off';
const ICON_INPUT_VISIBLE = 'eye';

export const AccessTokenInput = (props: Props) => {
    const [inputHidden, setInputHidden] = useState<boolean>(true);

    return (
        <>
            <TextInput
                label="YNAB Personal Access Token"
                onChangeText={props.setToken}
                value={props.token}
                secureTextEntry={inputHidden}
                error={props.connectionStatus.status === LoadingStatus.ERROR}
                right={
                    <TextInput.Icon
                        icon={inputHidden ? ICON_INPUT_HIDDEN : ICON_INPUT_VISIBLE}
                        onPress={() => setInputHidden(!inputHidden)}
                        forceTextInputFocus={false}
                    />
                }
            />
            {props.connectionStatus.status === LoadingStatus.ERROR
                ? (
                    <HelperText type="error">
                        {`Error ${props.connectionStatus.error?.id}: ${props.connectionStatus.error?.detail}`}
                    </HelperText>
                )
                : null
            }
        </>);
};
