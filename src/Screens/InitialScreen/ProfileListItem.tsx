import { useCallback } from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { StackParameterList, MyStackNavigationProp } from '../../Navigation/ScreenParameters';
import { selectProfile } from '../../redux/features/profiles/profilesSlice';

type Props<T extends keyof StackParameterList> = {
    navigation: MyStackNavigationProp<T>,
}

const ICON_PROFILE_EXISTS = 'check-circle-outline';
const ICON_PROFILE_MISSING = 'checkbox-blank-circle-outline';

export const ProfileListItem = <T extends keyof StackParameterList>({ navigation }: Props<T>) => {
    const profile = useAppSelector(selectProfile);

    const navigateToProfileSettings = useCallback(
        () => navigation.navigate(ScreenNames.PROFILE_SCREEN),
        [navigation],
    );

    const listIcon = useCallback(
        (props: object) => {
            const icon = profile ? ICON_PROFILE_EXISTS : ICON_PROFILE_MISSING;
            return <List.Icon {...props} icon={icon} />;
        },
        [profile],
    );

    return (
        <List.Item
            title='Set up profile'
            left={listIcon}
            onPress={navigateToProfileSettings}
        />
    );
};
