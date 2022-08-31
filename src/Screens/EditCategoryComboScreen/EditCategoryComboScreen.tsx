import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Input } from '@ui-kitten/components';
import React, { useState } from 'react';
import { StackParameterList } from '../../Helper/Navigation/ScreenParameters';

type ScreenName = 'Edit Category Combo';
type MyNavigationProp = StackNavigationProp<StackParameterList, ScreenName>;
type MyRouteProp = RouteProp<StackParameterList, ScreenName>;

type Props = {
    navigation: MyNavigationProp;
    route: MyRouteProp;
}

export const EditCategoryComboScreen = ({ navigation, route }: Props) => {
    const [name, setName] = useState<string>(route.params.categoryCombo?.name ?? '');

    const {
        categoryCombo,
        saveCategoryCombo,
        deleteCategoryCombo
    } = route.params;

    return <>
        <Card>
            {/* <Input
                value={name}
                onChangeText={text => setName(text)}
                label='Category Combination Name' /> */}
        </Card>
    </>
}
