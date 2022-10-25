import merge from 'deepmerge';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { selectThemeTypeSetting } from '../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from './useAppSelector';
import { ThemeType } from '../redux/features/displaySettings/ThemeType';
import { StatusBarStyle } from 'expo-status-bar';

const DARK_COLOR_SCHEME = 'dark';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const lightTheme = useMemo(() => {
        const theme = merge(
            merge(PaperDefaultTheme, NavigationDefaultTheme),
            {
                darkAppBar: true,
                statusBarColorScheme: 'light' as StatusBarStyle,
                colors: { textOnAppBar: 'white' },
            });
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, []);

    const darkTheme = useMemo(() => {
        const theme = merge(
            merge(PaperDarkTheme, NavigationDarkTheme),
            {
                darkAppBar: true,
                statusBarColorScheme: 'light' as StatusBarStyle,
                colors: { textOnAppBar: 'white' },
            });
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, []);

    const themeToUse = useMemo(() => {
        switch (themeTypeSetting) {
            case ThemeType.DARK:
                return darkTheme;
            case ThemeType.LIGHT:
                return lightTheme;
            default:
                return colorScheme === DARK_COLOR_SCHEME ? darkTheme : lightTheme;
        }
    }, [themeTypeSetting, colorScheme, lightTheme, darkTheme]);

    return [
        themeToUse,
    ];
};
