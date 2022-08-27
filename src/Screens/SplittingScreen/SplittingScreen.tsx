import React from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import LoadingComponent from '../../Component/LoadingComponent';
import { SplittingScreenStackParameterList } from '../../Helper/Navigation/ScreenParameters';

import useProfiles from '../../Hooks/useProfiles';
import useBudgets from '../../Hooks/useBudgets';
import useLocalization from '../../Hooks/useLocalization';
import InitializedSplittingScreen from './InitializedSplittingScreen';

interface Props {
    navigation: DrawerNavigationProp<SplittingScreenStackParameterList>,
    route: RouteProp<SplittingScreenStackParameterList, 'Split Transaction'>,
}

const SplittingScreen = (props: Props) => {
    const { numberFormatSettings } = useLocalization();
    const [profiles] = useProfiles();
    const [budgets] = useBudgets();

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

