import React from 'react';
import { Modal, Portal, RadioButton } from 'react-native-paper';
import { saveThemeTypeSetting, selectThemeTypeSetting } from '../../redux/features/displaySettings/displaySettingsSlice';
import { ThemeType } from '../../redux/features/displaySettings/ThemeType';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

interface Props {
    visible: boolean,
    toggleVisible: () => void,
}

export const ThemeModalPortal = (props: Props) => {
    const dispatch = useAppDispatch();
    const themeTypeSetting = useAppSelector(selectThemeTypeSetting);

    const radioButton = (themeType: ThemeType) => (
        <RadioButton.Item
            key={themeType}
            // TODO: Do not use ThemeType's toString on UI
            label={themeType.toString()}
            value={themeType.toString()}
        />
    );

    return (
        <Portal>
            <Modal
                visible={props.visible}
                onDismiss={props.toggleVisible}
            >
                <RadioButton.Group
                    value={themeTypeSetting.toString()}
                    onValueChange={(value) => {
                        dispatch(saveThemeTypeSetting(value as ThemeType));
                    }}
                >
                    {radioButton(ThemeType.SYSTEM_DEFAULT)}
                    {radioButton(ThemeType.DARK)}
                    {radioButton(ThemeType.LIGHT)}
                </RadioButton.Group>
            </Modal>
        </Portal>
    );
};
