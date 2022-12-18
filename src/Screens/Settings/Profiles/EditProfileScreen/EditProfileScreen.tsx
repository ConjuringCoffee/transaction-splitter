import React, { useCallback, useMemo } from 'react';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';
import { deleteProfile } from '../../../../redux/features/profiles/profilesSlice';
import { AppBarMoreMenu } from '../../../../Component/AppBarMoreMenu';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';
import { useNavigationBar } from '../../../../Hooks/useNavigationBar';

type ScreenName = 'EditProfile';

const SCREEN_TITLE = 'Edit Profile';
const ICON_SAVE = 'content-save';

export const EditProfileScreen = (props: MyStackScreenProps<ScreenName>) => {
    const { navigation } = props;
    const { profileId } = props.route.params;

    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const [
        budgetInProfile1,
        setBudgetInProfile1,
        budgetInProfile2,
        setBudgetInProfile2,
        isValid,
        save,
    ] = useEditableBudgetsInProfiles(profileId);

    const dispatch = useAppDispatch();
    const [navigateBack] = useNavigateBack(navigation);

    const saveAndNavigate = useCallback(async (): Promise<void> => {
        save();
        navigateBack();
    }, [navigateBack, save]);

    const onSelectDeletion = useCallback(
        (): void => {
            dispatch(deleteProfile(profileId));
            setMenuVisible(false);
            navigateBack();
        },
        [profileId, dispatch, navigateBack],
    );

    const moreMenu = useMemo(() => {
        return (
            <AppBarMoreMenu
                key='more'
                visible={menuVisible}
                setVisible={setMenuVisible}
            >
                <Menu.Item
                    title="Delete"
                    onPress={onSelectDeletion}
                />
            </AppBarMoreMenu>);
    }, [menuVisible, onSelectDeletion]);

    const navigationBarAdditions = useMemo(
        () => (
            [
                <Appbar.Action
                    key='save'
                    icon={ICON_SAVE}
                    disabled={!isValid}
                    onPress={saveAndNavigate}
                />,
                moreMenu,
            ]
        ),
        [isValid, moreMenu, saveAndNavigate],
    );

    useNavigationBar({
        title: SCREEN_TITLE,
        navigation: navigation,
        additions: navigationBarAdditions,
    });

    return (
        <CustomScrollView>
            <BudgetInProfileInputSection
                editableBudgetInProfile={budgetInProfile1}
                setEditableBudgetInProfile={setBudgetInProfile1}
            />
            <BudgetInProfileInputSection
                editableBudgetInProfile={budgetInProfile2}
                setEditableBudgetInProfile={setBudgetInProfile2}
            />
        </CustomScrollView>
    );
};
