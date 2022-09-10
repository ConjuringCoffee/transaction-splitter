import { useCallback, useState } from 'react';
import { API } from 'ynab';
import { LoadingStatus } from '../Helper/LoadingStatus';

export interface ConnectionStatus {
    status: LoadingStatus,
    error?: {
        id: string,
        detail: string
    }
}

export const useConnectionTest = (): [ConnectionStatus, (accessToken: string) => void] => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: LoadingStatus.IDLE });

    const testConnection = useCallback(async (accessToken: string) => {
        setConnectionStatus({ status: LoadingStatus.LOADING });

        try {
            await new API(accessToken).user.getUser();
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
    }, []);

    return [connectionStatus, testConnection];
};
