import { CommonActions } from '@react-navigation/native';
import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { StackParameterList, MyStackNavigationProp } from '../Navigation/ScreenParameters';

export const useNavigateBack = <T extends keyof StackParameterList>(navigation: MyStackNavigationProp<T>): [() => void] => {
    const navigateBack = useCallback(() => {
        Keyboard.dismiss();
        // This prevents multiple fast button presses to navigate back multiple times
        // See: https://github.com/react-navigation/react-navigation/issues/6864#issuecomment-635686686
        navigation.dispatch((state) => ({ ...CommonActions.goBack(), target: state.key }));
    }, [navigation]);

    return [navigateBack];
};
