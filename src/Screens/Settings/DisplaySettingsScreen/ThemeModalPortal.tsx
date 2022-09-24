import React, { useCallback, useMemo } from 'react';
import { Modal, Portal, RadioButton, useTheme } from 'react-native-paper';
import { saveThemeTypeSetting, selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { ThemeType } from '../../../redux/features/displaySettings/ThemeType';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { StyleSheet } from 'react-native';

interface Props {
    visible: boolean,
    toggleVisible: () => void,
}

export const ThemeModalPortal = (props: Props) => {
    const dispatch = useAppDispatch();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);
    const theme = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            padding: 10,
            margin: 20,
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.background,
        },
    }), [theme]);

    const radioButton = (themeType: ThemeType) => (
        <RadioButton.Item
            key={themeType.toString()}
            // TODO: Do not use ThemeType's toString on UI
            label={themeType.toString()}
            value={themeType.toString()}
        />
    );

    const save = useCallback(
        (newThemeType: string) => dispatch(saveThemeTypeSetting(newThemeType as ThemeType)),
        [dispatch],
    );

    const themeTypeSettingValue = useMemo(
        () => themeTypeSetting.toString(),
        [themeTypeSetting],
    );

    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.toggleVisible}
                contentContainerStyle={styles.modalContainer}
            >
                <RadioButton.Group
                    value={themeTypeSettingValue}
                    onValueChange={save}
                >
                    {radioButton(ThemeType.SYSTEM_DEFAULT)}
                    {radioButton(ThemeType.DARK)}
                    {radioButton(ThemeType.LIGHT)}
                </RadioButton.Group>
            </Modal>
        </Portal>
    );
};


