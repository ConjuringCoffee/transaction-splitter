import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import { NavigationBar } from '../../Helper/Navigation/NavigationBar';
import { MyStackScreenProps } from '../../Helper/Navigation/ScreenParameters';
import { saveAccessToken, selectAccessToken } from '../../redux/features/accessToken/accessTokenSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type ScreenName = 'Access Token';

const SCREEN_TITLE = 'Access Token';

const ICON_SAVE = 'content-save';
const ICON_INPUT_HIDDEN = 'eye-off';
const ICON_INPUT_VISIBLE = 'eye';

export const AccessTokenScreen = ({ navigation }: MyStackScreenProps<ScreenName>) => {
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(selectAccessToken);

    const [enteredToken, setEnteredToken] = useState<string>('');
    const [inputHidden, setInputHidden] = useState<boolean>(true);


    useLayoutEffect(() => {
        const addition = (
            <Appbar.Action
                icon={ICON_SAVE}
                onPress={() => {
                    dispatch(saveAccessToken(enteredToken));
                }} />);

        navigation.setOptions({
            header: () => (
                <NavigationBar
                    title={SCREEN_TITLE}
                    navigation={navigation}
                    additions={addition}
                />
            ),
        });
    }, [navigation, dispatch, enteredToken]);

    return (
        <View>
            <TextInput
                label="YNAB Personal Access Token"
                onChangeText={setEnteredToken}
                defaultValue={accessToken}
                secureTextEntry={inputHidden}
                right={
                    <TextInput.Icon
                        icon={inputHidden ? ICON_INPUT_HIDDEN : ICON_INPUT_VISIBLE}
                        onPress={() => setInputHidden(!inputHidden)}
                        forceTextInputFocus={false}
                    />
                }
            />
        </View>
    );
};
