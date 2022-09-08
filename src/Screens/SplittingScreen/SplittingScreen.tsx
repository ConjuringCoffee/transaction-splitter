import React, { useEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import LoadingComponent from '../../Component/LoadingComponent';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';
import useLocalization from '../../Hooks/useLocalization';
import InitializedSplittingScreen from './InitializedSplittingScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { Appbar } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProfiles, selectAllProfiles, selectProfilesFetchStatus } from '../../redux/features/profiles/profilesSlice';
import { fetchBudgets, selectBudgets, selectBudgetsFetchStatus } from '../../redux/features/ynab/ynabSlice';
import { LoadingStatus } from '../../Helper/LoadingStatus';

interface Props {
    navigation: StackNavigationProp<StackParameterList>,
    route: RouteProp<StackParameterList, 'Split Transaction'>,
}

const SplittingScreen = (props: Props) => {
    const dispatch = useAppDispatch();

    const { numberFormatSettings } = useLocalization();

    const budgets = useAppSelector(selectBudgets);
    const budgetsFetchStatus = useAppSelector(selectBudgetsFetchStatus);

    const profilesFetchStatus = useAppSelector(selectProfilesFetchStatus);
    const profiles = useAppSelector(selectAllProfiles);

    useEffect(() => {
        if (budgetsFetchStatus.status === 'idle') {
            dispatch(fetchBudgets());
        }
    }, [budgetsFetchStatus, dispatch]);

    useEffect(() => {
        if (profilesFetchStatus.status === LoadingStatus.IDLE) {
            dispatch(fetchProfiles());
        }
    }, [profilesFetchStatus, dispatch]);

    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={'Transaction Splitter'}
                    navigation={props.navigation}
                    additions={
                        <Appbar.Action
                            onPress={() => props.navigation.navigate(ScreenNames.settingsOverviewScreen)}
                            icon='cog' />
                    }
                />
            ),
        });
    }, [
        props.navigation
    ]);

    return (
        <>
            {numberFormatSettings
                && budgetsFetchStatus.status === 'successful'
                && profilesFetchStatus.status === LoadingStatus.SUCCESSFUL
                && profiles.length === 2
                ? <InitializedSplittingScreen
                    navigation={props.navigation}
                    numberFormatSettings={numberFormatSettings}
                    budgets={budgets}
                    profiles={profiles} />
                : <LoadingComponent />}
        </>
    );
};

export default SplittingScreen;

