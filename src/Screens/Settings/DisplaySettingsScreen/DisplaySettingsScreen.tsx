import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { ThemeModalPortal } from './ThemeModalPortal';

export const DisplaySettingsScreen = () => {
    const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

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
