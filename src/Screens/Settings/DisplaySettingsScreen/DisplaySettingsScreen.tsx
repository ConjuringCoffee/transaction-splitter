import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { ThemeModalPortal } from './ThemeModalPortal';
import { MyStackScreenProps } from '../../../Navigation/ScreenParameters';
import { useNavigationBar } from '../../../Hooks/useNavigationBar';

type ScreenName = 'DisplaySettings';

const SCREEN_TITLE = 'Display Settings';

export const DisplaySettingsScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
    });

    const toggleThemeModalVisible = useCallback(
        () => setThemeModalVisible(!themeModalVisible),
        [themeModalVisible],
    );

    const themeTypeDescription = useMemo(
        () => themeTypeSetting.toString(),
        [themeTypeSetting],
    );

    const showThemeModal = useCallback(() => setThemeModalVisible(true), []);

    return (
        <View>
            <List.Item
                title='Theme'
                // TODO: Do not use ThemeType's toString on UI
                description={themeTypeDescription}
                onPress={showThemeModal}
            />
            <ThemeModalPortal
                visible={themeModalVisible}
                toggleVisible={toggleThemeModalVisible}
            />
        </View>
    );
};
