import { useEffect, useMemo, useState } from 'react';
import { LoadingStatus } from '../Helper/LoadingStatus';
import { selectAccessTokenFetchStatus, fetchAccessToken, selectAccessToken } from '../redux/features/accessToken/accessTokenSlice';
import { selectCategoryCombosFetchStatus, fetchCategoryCombos } from '../redux/features/categoryCombos/categoryCombosSlice';
import { selectDisplaySettingsFetchStatus, fetchDisplaySettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { selectProfilesFetchStatus, fetchProfiles, selectProfiles } from '../redux/features/profiles/profilesSlice';
import { selectBudgetsFetchStatus, fetchBudgets } from '../redux/features/ynab/ynabSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useConnectionTest } from './useConnectionTest';

export enum InitialFetchStatus {
    UNKNOWN,
    READY,
    SETUP_REQUIRED,
}

export const useInitialFetchStatus = (): [InitialFetchStatus] => {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectAccessToken);
    const profiles = useAppSelector(selectProfiles);

    const [initialFetchStatus, setInitialFetchStatus] = useState<InitialFetchStatus>(InitialFetchStatus.UNKNOWN);
    const [connectionStatus, testConnection] = useConnectionTest();
    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);
    const displaySettingsFetchStatus = useAppSelector(selectDisplaySettingsFetchStatus);
    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const budgetsFetchStatus = useAppSelector(selectBudgetsFetchStatus);
    const categoryCombosFetchStatus = useAppSelector(selectCategoryCombosFetchStatus);

    useEffect(() => {
        if (displaySettingsFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchDisplaySettings());
        }
    }, [displaySettingsFetchStatus, dispatch]);

    useEffect(() => {
        if (accessTokenFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchAccessToken());
        }
    }, [accessTokenFetchStatus, dispatch]);

    useEffect(
        () => {
            if (accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL && connectionStatus.status === LoadingStatus.IDLE) {
                testConnection(accessToken);
            }
        },
        [accessToken, accessTokenFetchStatus, connectionStatus, testConnection],
    );

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    useEffect(() => {
        if (budgetsFetchStatus.status === LoadingStatus.IDLE && connectionStatus.status === LoadingStatus.SUCCESSFUL) {
            dispatch(fetchBudgets(accessToken));
        }
    }, [budgetsFetchStatus, dispatch, connectionStatus, accessToken]);

    useEffect(() => {
        if (categoryCombosFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchCategoryCombos());
        }
    }, [categoryCombosFetchStatus, dispatch]);

    const localLoaded = useMemo(
        () => {
            return accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL
                && displaySettingsFetchStatus.status === LoadingStatus.SUCCESSFUL
                && profilesFetchStatus.status === LoadingStatus.SUCCESSFUL
                && categoryCombosFetchStatus.status === LoadingStatus.SUCCESSFUL;
        },
        [accessTokenFetchStatus, categoryCombosFetchStatus, displaySettingsFetchStatus, profilesFetchStatus],
    );

    useEffect(
        () => {
            if (!localLoaded || connectionStatus.status === LoadingStatus.IDLE || connectionStatus.status === LoadingStatus.LOADING) {
                return;
            } else if (connectionStatus.status === LoadingStatus.ERROR || profiles.length === 0) {
                setInitialFetchStatus(InitialFetchStatus.SETUP_REQUIRED);
            } else if (budgetsFetchStatus.status === LoadingStatus.SUCCESSFUL) {
                setInitialFetchStatus(InitialFetchStatus.READY);
            }
        },
        [localLoaded, connectionStatus, profiles, budgetsFetchStatus, initialFetchStatus],
    );

    return [
        initialFetchStatus,
    ];
};
