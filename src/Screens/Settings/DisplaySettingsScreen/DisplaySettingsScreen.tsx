import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { selectNumberFormatSettings, selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { THEME_TYPE_LABELS } from '../../../redux/features/displaySettings/ThemeType';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { ThemeModalPortal } from './ThemeModalPortal';
import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { useNavigationSettings } from '../../../Hooks/useNavigationSettings';

type ScreenName = 'DisplaySettings';

const SCREEN_TITLE = 'Display Settings';

export const DisplaySettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);
    const numberFormatSettings = useAppSelector(selectNumberFormatSettings);

    useNavigationSettings({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    const toggleThemeModalVisible = useCallback(
        () => setThemeModalVisible(!themeModalVisible),
        [themeModalVisible],
    );

    const themeTypeDescription = useMemo(
        () => THEME_TYPE_LABELS[themeTypeSetting],
        [themeTypeSetting],
    );

    const showThemeModal = useCallback(() => setThemeModalVisible(true), []);

    const numberFormatExample = useMemo(
        () => `1${numberFormatSettings.digitGroupingSeparator}000${numberFormatSettings.decimalSeparator}001`,
        [numberFormatSettings],
    );

    return (
        <View>
            <List.Item
                title='Theme'
                description={themeTypeDescription}
                onPress={showThemeModal}
            />
            <List.Item
                title='Number Format'
                description={numberFormatExample}
            />
            <ThemeModalPortal
                visible={themeModalVisible}
                toggleVisible={toggleThemeModalVisible}
            />
        </View>
    );
};
