import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useLayoutEffect, useMemo } from 'react';
import { NavigationBar } from '../Navigation/NavigationBar';
import { MyStackNavigationProp, StackParameterList } from '../Navigation/ScreenParameters';

type Props<T extends keyof StackParameterList> = {
    title: string,
    navigation: MyStackNavigationProp<T> | StackNavigationProp<ParamListBase, string, undefined>
    additions?: Array<JSX.Element | null> | JSX.Element | null
}

export const useNavigationBar = <T extends keyof StackParameterList>({ title, navigation, additions }: Props<T>): void => {
    const navigationBar = useMemo(
        () => (
            <NavigationBar
                title={title}
                navigation={navigation}
                additions={additions}
            />
        ),
        [additions, navigation, title],
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => navigationBar,
        });
    }, [
        navigation,
        navigationBar,
    ]);
};
