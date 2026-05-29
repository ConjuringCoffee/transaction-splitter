import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { saveThemeTypeSetting, selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { THEME_TYPE_LABELS, ThemeType } from '../../../redux/features/displaySettings/ThemeType';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { useThrowingDispatch } from '../../../Hooks/useThrowingDispatch';
import { PortalModal } from '../../../Component/PortalModal';

type Props = {
    visible: boolean,
    toggleVisible: () => void,
}

export const ThemeModalPortal = (props: Props) => {
    const throwingDispatch = useThrowingDispatch();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const radioButton = (themeType: ThemeType) => (
        <RadioButton.Item
            key={themeType}
            label={THEME_TYPE_LABELS[themeType]}
            value={themeType}
        />
    );

    const save = useCallback(
        async (newThemeType: string) => {
            try {
                await throwingDispatch(saveThemeTypeSetting(newThemeType as ThemeType));
            } catch {
                Alert.alert('Error', 'Could not save. Please try again.');
            }
        },
        [throwingDispatch],
    );

    return (
        <PortalModal
            visible={props.visible}
            toggleVisible={props.toggleVisible}
        >
            <RadioButton.Group
                value={themeTypeSetting}
                onValueChange={save}
            >
                {radioButton(ThemeType.SYSTEM_DEFAULT)}
                {radioButton(ThemeType.DARK)}
                {radioButton(ThemeType.LIGHT)}
            </RadioButton.Group>
        </PortalModal>
    );
};
