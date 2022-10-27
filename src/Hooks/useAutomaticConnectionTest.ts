import { useEffect } from 'react';
import { selectAccessToken } from '../redux/features/accessToken/accessTokenSlice';
import { useAppSelector } from './useAppSelector';
import { ConnectionStatus, useConnectionTest } from './useConnectionTest';

export const useAutomaticConnectionTest = (): [ConnectionStatus] => {
    const accessToken = useAppSelector(selectAccessToken);
    const [connectionStatus, testConnection] = useConnectionTest();

    useEffect(
        () => {
            testConnection(accessToken);
        },
        [accessToken, testConnection],
    );

    return [connectionStatus];
};
