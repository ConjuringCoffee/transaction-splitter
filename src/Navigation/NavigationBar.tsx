import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { MyStackNavigationProp, StackParameterList } from './ScreenParameters';

type Props<A extends keyof StackParameterList> = {
    title: string,
    subtitle?: string,
    navigation: MyStackNavigationProp<A> | StackNavigationProp<ParamListBase, string, undefined>
    additions?: Array<JSX.Element | null> | JSX.Element | null
}

export const NavigationBar = <A extends keyof StackParameterList>(props: Props<A>) => {
    const theme = useTheme();

    return (
        <Appbar.Header dark={theme.darkAppBar}>
            {
                props.navigation.canGoBack()
                    ? <Appbar.BackAction onPress={() => {
                        Keyboard.dismiss();
                        props.navigation.goBack();
                    }} />
                    : null
            }
            <Appbar.Content
                title={props.title}
                subtitle={props.subtitle}
            />
            {props.additions}
        </Appbar.Header>);
};
