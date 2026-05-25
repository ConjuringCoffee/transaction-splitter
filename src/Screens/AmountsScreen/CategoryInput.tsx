import React, { useCallback } from 'react';
import { TextInput, TouchableRipple } from 'react-native-paper';
import { View } from 'react-native';
import { useTheme } from '../../Hooks/useTheme';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { MyStackNavigationProp, StackParameterList } from '../../Navigation/ScreenParameters';

type Props<T extends keyof StackParameterList> = {
    label: string,
    text: string,
    budgetId: string,
    onSelect: (id?: string) => void,
    navigation: MyStackNavigationProp<T>,
}

export const CategoryInput = <T extends keyof StackParameterList>({ navigation, budgetId, onSelect, ...props }: Props<T>) => {
    const [theme] = useTheme();

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
        <TouchableRipple onPress={navigateToCategoryScreen}>
            <View pointerEvents='none'>
                <TextInput
                    label={props.label}
                    value={props.text}
                    mode='outlined'
                    editable={false}
                    outlineColor={props.text ? theme.colors.primary : undefined}
                    style={props.text ? { backgroundColor: theme.colors.secondaryContainer } : undefined}
                />
            </View>
        </TouchableRipple>
    );
};
