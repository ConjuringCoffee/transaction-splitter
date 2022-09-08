import React from 'react';
import { Layout, List, ListItem } from '@ui-kitten/components';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Calculation History';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const CalculationHistoryScreen = ({ route, navigation }: Props) => {
    const { previousCalculations } = route.params;

    interface RenderItemProps {
        item: string,
        index: number
    }

    const renderItem = (props: RenderItemProps) => (
        <ListItem
            title={`${props.item}`}
            onPress={() => {
                navigation.goBack();
                route.params.onSelectCalculation(props.item);
            }} />
    );

    return (
        <Layout>
            <List
                data={previousCalculations}
                renderItem={renderItem} />
        </Layout>
    );
};
