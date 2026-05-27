import React, { useCallback } from 'react';
import { RadioButton } from 'react-native-paper';
import { saveThemeTypeSetting, selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { THEME_TYPE_LABELS, ThemeType } from '../../../redux/features/displaySettings/ThemeType';
import { useAppSelector } from '../../../Hooks/useAppSelector';
import { useAppDispatch } from '../../../Hooks/useAppDispatch';
import { PortalModal } from '../../../Component/PortalModal';

type Props = {
    visible: boolean,
    toggleVisible: () => void,
}

export const ThemeModalPortal = (props: Props) => {
    const dispatch = useAppDispatch();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const radioButton = (themeType: ThemeType) => (
        <RadioButton.Item
            key={themeType}
            label={THEME_TYPE_LABELS[themeType]}
            value={themeType}
        />
    );

    const save = useCallback(
        (newThemeType: string) => dispatch(saveThemeTypeSetting(newThemeType as ThemeType)),
        [dispatch],
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
