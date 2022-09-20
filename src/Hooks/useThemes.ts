import merge from 'deepmerge';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useMemo } from 'react';

export const useThemes = () => {
    const combinedLightTheme = useMemo(() => {
        const theme = merge(merge(PaperDefaultTheme, NavigationDefaultTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, []);

    const combinedDarkTheme = useMemo(() => {
        const theme = merge(merge(PaperDarkTheme, NavigationDarkTheme), { darkAppBar: true, colors: { textOnAppBar: 'white' } });
        theme.colors.primary = '#5C9CA4';
        return theme;
    }, []);

    return {
        darkTheme: combinedDarkTheme,
        lightTheme: combinedLightTheme,
    };
};
