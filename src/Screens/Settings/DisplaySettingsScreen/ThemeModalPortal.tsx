import React, { useCallback, useMemo } from 'react';
import { RadioButton } from 'react-native-paper';
import { saveThemeTypeSetting, selectThemeTypeSetting } from '../../../redux/features/displaySettings/displaySettingsSlice';
import { ThemeType } from '../../../redux/features/displaySettings/ThemeType';
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
        <PortalModal
            visible={props.visible}
            toggleVisible={props.toggleVisible}
        >
            <RadioButton.Group
                value={themeTypeSettingValue}
                onValueChange={save}
            >
                {radioButton(ThemeType.SYSTEM_DEFAULT)}
                {radioButton(ThemeType.DARK)}
                {radioButton(ThemeType.LIGHT)}
            </RadioButton.Group>
        </PortalModal>
    );
};
