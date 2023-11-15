import { useCallback, useMemo } from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { ScreenNames } from '../../Navigation/ScreenNames';
import { StackParameterList, MyStackNavigationProp } from '../../Navigation/ScreenParameters';
import { selectProfiles } from '../../redux/features/profiles/profilesSlice';

type Props<T extends keyof StackParameterList> = {
    navigation: MyStackNavigationProp<T>,
}

const ICON_PROFILE_EXISTS = 'check-circle-outline';
const ICON_PROFILE_MISSING = 'checkbox-blank-circle-outline';

export const ProfileListItem = <T extends keyof StackParameterList>({ navigation }: Props<T>) => {
    const profiles = useAppSelector(selectProfiles);

    const navigateToProfileSettings = useCallback(
        () => {
            if (profiles.length) {
                // TODO: Support more than one profile
                navigation.navigate(ScreenNames.EDIT_PROFILE_SCREEN, { profileId: profiles[0].id });
            } else {
                navigation.navigate(ScreenNames.CREATE_PROFILE_SCREEN);
            }
        },
        [navigation, profiles],
    );

    const icon = useMemo(
        () => profiles.length ? ICON_PROFILE_EXISTS : ICON_PROFILE_MISSING,
        [profiles],
    );

    return (
        <List.Item
            title='Set up profile'
            // eslint-disable-next-line react/no-unstable-nested-components
            left={(props) => <List.Icon {...props} icon={icon} />}
            onPress={navigateToProfileSettings}
        />
    );
};
