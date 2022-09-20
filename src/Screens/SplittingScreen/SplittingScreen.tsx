import React, { useEffect, useLayoutEffect } from 'react';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { InitializedSplittingScreen } from './InitializedSplittingScreen';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { Appbar } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProfiles, selectAllProfiles, selectProfilesFetchStatus } from '../../redux/features/profiles/profilesSlice';
import { fetchBudgets, selectBudgets, selectBudgetsFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';
import { LoadingComponent } from '../../Component/LoadingComponent';

type ScreenName = 'Split Transaction';

const SCREEN_TITLE = 'Transaction Splitter';
const ICON_SETTINGS = 'cog';

export const SplittingScreen = (props: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();

    const budgets = useAppSelector(selectBudgets);
    const budgetsFetchStatus = useAppSelector(selectBudgetsFetchStatus);

    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const profiles = useAppSelector(selectAllProfiles);

    useEffect(() => {
        if (budgetsFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchBudgets());
        }
    }, [budgetsFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={props.navigation}
                    additions={
                        <Appbar.Action
                            onPress={() => props.navigation.navigate(ScreenNames.SETTINGS_OVERVIEW_SCREEN)}
                            icon={ICON_SETTINGS} />
                    }
                />
            ),
        });
    }, [props.navigation]);

    return (
        <>
            {budgetsFetchStatus.status === LoadingStatus.SUCCESSFUL
                && profilesFetchStatus.status === LoadingStatus.SUCCESSFUL
                && profiles.length === 2
                ? <InitializedSplittingScreen
                    navigation={props.navigation}
                    budgets={budgets}
                    profiles={profiles} />
                : <LoadingComponent />}
        </>
    );
};
