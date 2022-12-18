import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { MyStackNavigationProp, StackParameterList } from './ScreenParameters';

type Props<T extends keyof StackParameterList> = {
    title: string,
    subtitle?: string,
    navigation: MyStackNavigationProp<T> | StackNavigationProp<ParamListBase, string, undefined>
    additions?: Array<JSX.Element | null> | JSX.Element | null
}

export const NavigationBar = <T extends keyof StackParameterList>({ navigation, ...props }: Props<T>) => {
    const theme = useTheme();

    const navigateBack = useCallback(
        () => {
            Keyboard.dismiss();
            navigation.goBack();
        },
        [navigation],
    );

    return (
        <Appbar.Header dark={theme.darkAppBar}>
            {
                navigation.canGoBack()
                    ? (
                        <Appbar.BackAction onPress={navigateBack} />
                    )
                    : null
            }
            <Appbar.Content
                title={props.title}
                subtitle={props.subtitle}
            />
            {props.additions}
        </Appbar.Header>);
};
