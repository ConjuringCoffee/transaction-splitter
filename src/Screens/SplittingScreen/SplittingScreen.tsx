import React from 'react';
import { RouteProp } from '@react-navigation/native';
import LoadingComponent from '../../Component/LoadingComponent';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';

import useProfiles from '../../Hooks/useProfiles';
import useBudgets from '../../Hooks/useBudgets';
import useLocalization from '../../Hooks/useLocalization';
import InitializedSplittingScreen from './InitializedSplittingScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { Button } from '@ui-kitten/components';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import SettingsIcon from '../../Component/SettingsIcon';
import { Appbar } from 'react-native-paper';

interface Props {
    navigation: StackNavigationProp<StackParameterList>,
    route: RouteProp<StackParameterList, 'Split Transaction'>,
}

const SplittingScreen = (props: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [profiles] = useProfiles();
    const [budgets] = useBudgets();

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
            {numberFormatSettings && budgets && profiles
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

