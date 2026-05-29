import { useEffect, useMemo } from 'react';
import { LoadingStatus } from '../Helper/LoadingStatus';
import { selectAccessTokenFetchStatus, fetchAccessToken, selectAccessToken } from '../redux/features/accessToken/accessTokenSlice';
import { selectCategoryCombosFetchStatus, fetchCategoryCombos } from '../redux/features/categoryCombos/categoryCombosSlice';
import { selectDisplaySettingsFetchStatus, fetchDisplaySettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { selectProfileFetchStatus, fetchProfile, selectProfile } from '../redux/features/profile/profileSlice';
import { selectBudgetsFetchStatus, fetchBudgets } from '../redux/features/ynab/ynabSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useConnectionTest } from './useConnectionTest';

export enum InitialFetchStatus {
    UNKNOWN,
    READY,
    SETUP_REQUIRED,
    ERROR,
}

export const useInitialFetchStatus = (): [InitialFetchStatus] => {
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectAccessToken);
    const profile = useAppSelector(selectProfile);

    const [connectionStatus, testConnection] = useConnectionTest();
    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);
    const displaySettingsFetchStatus = useAppSelector(selectDisplaySettingsFetchStatus);
    const profileFetchStatus = useAppSelector(selectProfileFetchStatus);
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
        if (profileFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfile());
        }
    }, [profileFetchStatus, dispatch]);

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

    const localStatus = useMemo(
        () => {
            const statuses = [accessTokenFetchStatus, displaySettingsFetchStatus, profileFetchStatus, categoryCombosFetchStatus];
            if (statuses.some((s) => s.status === LoadingStatus.ERROR)) {
                return LoadingStatus.ERROR;
            }
            if (statuses.every((s) => s.status === LoadingStatus.SUCCESSFUL)) {
                return LoadingStatus.SUCCESSFUL;
            }
            return LoadingStatus.LOADING;
        },
        [accessTokenFetchStatus, displaySettingsFetchStatus, profileFetchStatus, categoryCombosFetchStatus],
    );

    const initialFetchStatus = useMemo(
        () => {
            if (localStatus === LoadingStatus.ERROR) {
                return InitialFetchStatus.ERROR;
            }
            if (localStatus === LoadingStatus.SUCCESSFUL && (connectionStatus.status === LoadingStatus.ERROR || profile === null)) {
                return InitialFetchStatus.SETUP_REQUIRED;
            }
            if (localStatus === LoadingStatus.SUCCESSFUL && budgetsFetchStatus.status === LoadingStatus.SUCCESSFUL) {
                return InitialFetchStatus.READY;
            }
            if (localStatus === LoadingStatus.SUCCESSFUL && budgetsFetchStatus.status === LoadingStatus.ERROR) {
                return InitialFetchStatus.SETUP_REQUIRED;
            }
            return InitialFetchStatus.UNKNOWN;
        },
        [localStatus, connectionStatus, profile, budgetsFetchStatus],
    );

    return [
        initialFetchStatus,
    ];
};
