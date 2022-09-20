import merge from 'deepmerge';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { selectThemeTypeSetting } from '../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../redux/hooks';
import { ThemeType } from '../Helper/ThemeType';
import * as eva from '@eva-design/eva';

const DARK_COLOR_SCHEME = 'dark';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const lightTheme = useMemo(() => {
        const theme = merge(merge(PaperDefaultTheme, NavigationDefaultTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, []);

    const darkTheme = useMemo(() => {
        const theme = merge(merge(PaperDarkTheme, NavigationDarkTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
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

    const evaThemeToUse = useMemo(() => {
        switch (themeTypeSetting) {
            case ThemeType.DARK:
                return eva.dark;
            case ThemeType.LIGHT:
                return eva.light;
            default:
                return colorScheme === DARK_COLOR_SCHEME ? eva.dark : eva.light;
        }
    }, [themeTypeSetting, colorScheme]);

    return {
        theme: themeToUse,
        evaThema: evaThemeToUse,
    };
};
