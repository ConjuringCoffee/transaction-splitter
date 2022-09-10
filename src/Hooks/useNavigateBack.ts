import { CommonActions } from '@react-navigation/native';
import { useCallback } from 'react';
import { StackParameterList, MyStackNavigationProp } from '../Helper/Navigation/ScreenParameters';

export function useNavigateBack<T extends keyof StackParameterList>(navigation: MyStackNavigationProp<T>): [() => void] {
    const navigateBack = useCallback(() => {
        // This prevents multiple fast button presses to navigate back multiple times
        // See: https://github.com/react-navigation/react-navigation/issues/6864#issuecomment-635686686
        navigation.dispatch((state) => ({ ...CommonActions.goBack(), target: state.key }));
    }, [navigation]);

    return [navigateBack];
};
