import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Edit Category Combo';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const EditCategoryComboScreen = ({ navigation, route }: Props) => {
    const {
        categoryCombo,
        saveCategoryCombo,
        deleteCategoryCombo
    } = route.params;

    return <></>
}
