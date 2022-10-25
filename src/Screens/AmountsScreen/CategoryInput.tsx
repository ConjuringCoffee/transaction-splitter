import React from 'react';
import { Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ScreenNames } from '../../Helper/Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../../Helper/Navigation/ScreenParameters';

interface Props<T extends keyof StackParameterList> {
    label: string,
    text: string,
    budgetId: string,
    onSelect: (id?: string) => void,
    navigation: MyStackNavigationProp<T>,
}

export const CategoryInput = <T extends keyof StackParameterList>(props: Props<T>) => (
    <View style={styles.view}>
        <Text>
            {props.label}
        </Text>

        <Button
            mode='contained'
            onPress={() => {
                props.navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                    budgetId: props.budgetId,
                    onSelect: (categoryId?: string) => props.onSelect(categoryId),
                });
            }}>
            {props.text}
        </Button>
    </View>
);

const styles = StyleSheet.create({
    view: {
        flex: 1,
        margin: 5,
    },
});
