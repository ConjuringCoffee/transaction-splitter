import React, { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { useAutomaticConnectionTest } from '../../Hooks/useAutomaticConnectionTest';
import { useNavigationBar } from '../../Hooks/useNavigationBar';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { selectProfiles } from '../../redux/features/profiles/profilesSlice';
import { fetchBudgets, selectBudgetsFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { AccessTokenListItem } from './AccessTokenListItem';
import { ProfileListItem } from './ProfileListItem';

type ScreenName = 'InitialScreen';

const SCREEN_TITLE = 'Initial setup';

export const InitialScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    const accessToken = useAppSelector(selectAccessToken);
    const [connectionStatus] = useAutomaticConnectionTest();
    const profiles = useAppSelector(selectProfiles);
    const budgetsFetchStatus = useAppSelector(selectBudgetsFetchStatus);

    useEffect(
        () => {
            if (connectionStatus.status === LoadingStatus.SUCCESSFUL && budgetsFetchStatus.status === LoadingStatus.SUCCESSFUL) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenNames.SPLITTING_SCREEN }],
                });
            }
        },
        [accessToken, budgetsFetchStatus, connectionStatus, navigation],
    );

    const triggerBudgetLoad = useCallback(
        () => {
            if (budgetsFetchStatus.status === LoadingStatus.IDLE) {
                dispatch(fetchBudgets(accessToken));
            }
        },
        [dispatch, accessToken, budgetsFetchStatus],
    );

    const isReadyToContinue: boolean = useMemo(
        () => [profiles.length && connectionStatus.status === LoadingStatus.SUCCESSFUL].every(Boolean),
        [profiles, connectionStatus],
    );

    return (
        <View>
            <AccessTokenListItem
                navigation={navigation}
            />
            <ProfileListItem
                navigation={navigation}
            />
            <Button
                disabled={!isReadyToContinue}
                onPress={triggerBudgetLoad}
            >
                Continue
            </Button>
        </View>
    );
};
