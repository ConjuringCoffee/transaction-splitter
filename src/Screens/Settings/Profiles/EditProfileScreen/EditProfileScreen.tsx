import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { CustomScrollView } from '../../../../Component/CustomScrollView';
import { MyStackScreenProps } from '../../../../Navigation/ScreenParameters';
import { BudgetInProfileInputSection } from '../BudgetInProfileInputSection';
import { Appbar, Menu } from 'react-native-paper';
import { NavigationBar } from '../../../../Navigation/NavigationBar';
import { useNavigateBack } from '../../../../Hooks/useNavigateBack';
import { useEditableBudgetsInProfiles } from '../../../../Hooks/useEditableBudgetsInProfiles';
import { deleteProfile } from '../../../../redux/features/profiles/profilesSlice';
import { AppBarMoreMenu } from '../../../../Component/AppBarMoreMenu';
import { useAppDispatch } from '../../../../Hooks/useAppDispatch';

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

    const moreMenu = useMemo(() => {
        const deleteAndNavigate = async () => {
            await dispatch(deleteProfile(profileId));
            navigateBack();
        };

        return (
            <AppBarMoreMenu
                key='more'
                visible={menuVisible}
                setVisible={setMenuVisible}>
                <Menu.Item
                    title="Delete"
                    onPress={() => {
                        deleteAndNavigate();
                        setMenuVisible(false);
                    }} />
            </AppBarMoreMenu>);
    }, [
        profileId,
        navigateBack,
        menuVisible,
        dispatch,
    ]);

    useLayoutEffect(
        () => {
            const additions = [
                <Appbar.Action
                    key='save'
                    icon={ICON_SAVE}
                    disabled={!isValid}
                    onPress={saveAndNavigate}
                />,
                moreMenu,
            ];

            navigation.setOptions({
                header: () => (
                    <NavigationBar
                        title={SCREEN_TITLE}
                        navigation={navigation}
                        additions={additions}
                    />
                ),
            });
        },
        [navigation, isValid, saveAndNavigate, moreMenu],
    );

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
