import React from 'react';
import { MyStackScreenProps } from '../../Navigation/ScreenParameters';
import { FlatList, View } from 'react-native';
import { List } from 'react-native-paper';
import { useNavigateBack } from '../../Hooks/useNavigateBack';

type ScreenName = 'Calculation History';

export const CalculationHistoryScreen = ({ route, navigation }: MyStackScreenProps<ScreenName>) => {
    const { previousCalculations } = route.params;
    const [navigateBack] = useNavigateBack(navigation);

    const renderItem = ({ item }: { item: string }) => (
        <List.Item
            title={`${item}`}
            onPress={() => {
                route.params.onSelectCalculation(item);
                navigateBack();
            }} />
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
