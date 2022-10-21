import { useEffect, useMemo } from 'react';
import { LoadingStatus } from '../Helper/LoadingStatus';
import { selectAccessTokenFetchStatus, selectAccessToken, fetchAccessToken } from '../redux/features/accessToken/accessTokenSlice';
import { selectCategoryCombosFetchStatus, fetchCategoryCombos } from '../redux/features/categoryCombos/categoryCombosSlice';
import { selectDisplaySettingsFetchStatus, fetchDisplaySettings } from '../redux/features/displaySettings/displaySettingsSlice';
import { selectProfilesFetchStatus, fetchProfiles } from '../redux/features/profiles/profilesSlice';
import { selectBudgetsFetchStatus, fetchBudgets } from '../redux/features/ynab/ynabSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const useInitialFetch = (): [boolean] => {
    const dispatch = useAppDispatch();

    const accessTokenFetchStatus = useAppSelector(selectAccessTokenFetchStatus);
    const displaySettingsFetchStatus = useAppSelector(selectDisplaySettingsFetchStatus);
    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const budgetsFetchStatus = useAppSelector(selectBudgetsFetchStatus);
    const categoryCombosFetchStatus = useAppSelector(selectCategoryCombosFetchStatus);

    const accessToken = useAppSelector(selectAccessToken);

    useEffect(() => {
        if (accessTokenFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchAccessToken());
        }
    }, [accessTokenFetchStatus, dispatch]);

    useEffect(() => {
        if (displaySettingsFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchDisplaySettings());
        }
    }, [displaySettingsFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    useEffect(() => {
        if (budgetsFetchStatus.status === LoadingStatus.IDLE && accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL) {
            dispatch(fetchBudgets(accessToken));
        }
    }, [budgetsFetchStatus, dispatch, accessTokenFetchStatus, accessToken]);

    useEffect(() => {
        if (categoryCombosFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchCategoryCombos());
        }
    }, [categoryCombosFetchStatus, dispatch]);

    const everythingLoaded = useMemo(() => {
        return accessTokenFetchStatus.status === LoadingStatus.SUCCESSFUL
            && displaySettingsFetchStatus.status === LoadingStatus.SUCCESSFUL
            && profilesFetchStatus.status === LoadingStatus.SUCCESSFUL
            && budgetsFetchStatus.status === LoadingStatus.SUCCESSFUL
            && categoryCombosFetchStatus.status === LoadingStatus.SUCCESSFUL;
    }, [accessTokenFetchStatus, displaySettingsFetchStatus, profilesFetchStatus, budgetsFetchStatus, categoryCombosFetchStatus]);

    return [everythingLoaded];
};
