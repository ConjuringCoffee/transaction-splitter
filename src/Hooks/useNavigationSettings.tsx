import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLayoutEffect } from 'react';
import { MyStackNavigationProp, StackParameterList } from '../Navigation/ScreenParameters';

type Props<T extends keyof StackParameterList> = {
    title: string,
    navigation: MyStackNavigationProp<T> | StackNavigationProp<ParamListBase, string, undefined>
    additions?: Array<JSX.Element | null> | JSX.Element | null
}

export const useNavigationSettings = <T extends keyof StackParameterList>({ title, navigation, additions }: Props<T>): void => {
    useLayoutEffect(
        () => {
            navigation.setOptions({
                title: title,
                headerRight: () => (additions),
            });
        },
        [additions, navigation, title],
    );
};
