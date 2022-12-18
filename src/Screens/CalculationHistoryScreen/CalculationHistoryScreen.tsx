import React from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { FlatList, View } from 'react-native';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { useNavigationBar } from '../../Hooks/useNavigationBar';
import { HistoryListItem } from './HistoryListItem';

type ScreenName = 'Calculation History';

const SCREEN_TITLE = 'Calculation History';

export const CalculationHistoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const { previousCalculations } = route.params;
    const [navigateBack] = useNavigateBack(navigation);

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    const renderItem = ({ item }: { item: string }) => (
        <HistoryListItem
            calculation={item}
            selectCalculation={route.params.onSelectCalculation}
            navigateBack={navigateBack}
        />
    );

    return (
        <View>
            <FlatList
                data={previousCalculations}
                renderItem={renderItem}
            />
        </View>
    );
};
