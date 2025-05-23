import merge from 'deepmerge';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { selectThemeTypeSetting } from '../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from './useAppSelector';
import { ThemeType } from '../redux/features/displaySettings/ThemeType';

const DARK_COLOR_SCHEME = 'dark';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const styles = useMemo(() => ({ spacing: 8 }), []);

    const lightTheme = useMemo(() => {
        const theme = merge(merge(PaperDefaultTheme, NavigationDefaultTheme), styles);
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, [styles]);

    const darkTheme = useMemo(() => {
        const theme = merge(merge(PaperDarkTheme, NavigationDarkTheme), styles);
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, [styles]);

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
