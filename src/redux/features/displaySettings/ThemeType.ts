export enum ThemeType {
    SYSTEM_DEFAULT = 'System Default',
    LIGHT = 'Light',
    DARK = 'Dark',
}

export const THEME_TYPE_LABELS: Record<ThemeType, string> = {
    [ThemeType.SYSTEM_DEFAULT]: 'System Default',
    [ThemeType.LIGHT]: 'Light',
    [ThemeType.DARK]: 'Dark',
};
