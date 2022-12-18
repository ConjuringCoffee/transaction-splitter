import React, { useCallback } from 'react';
import { Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';

interface Props<T extends keyof StackParameterList> {
    label: string,
    text: string,
    budgetId: string,
    onSelect: (id?: string) => void,
    navigation: MyStackNavigationProp<T>,
}

export const CategoryInput = <T extends keyof StackParameterList>({ navigation, budgetId, onSelect, ...props }: Props<T>) => {
    const navigateToCategoryScreen = useCallback(
        () => {
            navigation.navigate(ScreenNames.CATEGORY_SCREEN, {
                budgetId: budgetId,
                onSelect: (categoryId?: string) => onSelect(categoryId),
            });
        },
        [budgetId, navigation, onSelect],
    );

    return (
        <View style={styles.view}>
            <Text>
                {props.label}
            </Text>

            <Button
                mode='contained'
                onPress={navigateToCategoryScreen}
            >
                {props.text}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        margin: 5,
    },
});
