import React from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { FlatList, View } from 'react-native';
import { List } from 'react-native-paper';
import { useNavigateBack } from '../../Hooks/useNavigateBack';
import { useNavigationBar } from '../../Hooks/useNavigationBar';

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
        <List.Item
            title={`${item}`}
            onPress={() => {
                route.params.onSelectCalculation(item);
                navigateBack();
            }}
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
