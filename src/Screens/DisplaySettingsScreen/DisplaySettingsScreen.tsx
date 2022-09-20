import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { selectThemeTypeSetting } from '../../redux/features/displaySettings/displaySettingsSlice';
import { useAppSelector } from '../../redux/hooks';
import { ThemeModalPortal } from './ThemeModalPortal';


export const DisplaySettingsScreen = () => {
    const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const toggleThemeModalVisible = useCallback(
        () => setThemeModalVisible(!themeModalVisible),
        [themeModalVisible],
    );

    return (
        <View>
            <List.Item
                title='Theme'
                // TODO: Do not use ThemeType's toString on UI
                description={themeTypeSetting.toString()}
                onPress={() => setThemeModalVisible(true)}
            />
            <ThemeModalPortal
                visible={themeModalVisible}
                toggleVisible={toggleThemeModalVisible}
            />
        </View>
    );
};
